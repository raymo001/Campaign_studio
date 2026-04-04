import {
  buildDeliveryFileName,
  getDeliveryBundle,
  normalizeFileNameTemplate,
  resolveTemplatePresetValues,
  type DeliveryFormatTarget,
} from "@/lib/template-presets";

type ExportAssetLike = {
  _id: string;
  publicUrl?: string;
  mimeType?: string;
  provider?: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
};

type ExportPackLike = {
  _id: string;
  name: string;
  platform: string;
  locale: string;
  objective?: string;
  campaignName?: string;
  templatePresetName?: string;
  deliveryBundleKey?: string;
  fileNameTemplate?: string;
  assets: ExportAssetLike[];
};

export function buildExportPackPreview(pack: ExportPackLike) {
  const resolved = resolveTemplatePresetValues({
    primaryPlatform: pack.platform,
    deliveryBundleKey: pack.deliveryBundleKey,
    fileNameTemplate: pack.fileNameTemplate,
  });
  const bundle = getDeliveryBundle(resolved.deliveryBundleKey);

  return {
    bundle,
    fileNameTemplate: normalizeFileNameTemplate(resolved.fileNameTemplate),
    files: pack.assets.flatMap((asset, assetIndex) =>
      bundle.targets.map((target) => ({
        assetId: asset._id,
        variantKey: target.key,
        target,
        fileName: buildDeliveryFileName({
          template: resolved.fileNameTemplate,
          campaignName: pack.campaignName || pack.name,
          platform: pack.platform,
          locale: pack.locale,
          objective: pack.objective,
          presetName: pack.templatePresetName,
          variantKey: target.key,
          assetIndex: assetIndex + 1,
          extension: target.extension,
        }),
      })),
    ),
  };
}

export function buildExportManifest(pack: ExportPackLike) {
  const preview = buildExportPackPreview(pack);

  return {
    exportPackId: pack._id,
    name: pack.name,
    platform: pack.platform,
    locale: pack.locale,
    objective: pack.objective || null,
    campaignName: pack.campaignName || null,
    bundle: {
      key: preview.bundle.key,
      name: preview.bundle.name,
      description: preview.bundle.description,
      targets: preview.bundle.targets,
    },
    fileNameTemplate: preview.fileNameTemplate,
    assets: pack.assets.map((asset, assetIndex) => ({
      assetId: asset._id,
      source: {
        publicUrl: asset.publicUrl || null,
        mimeType: asset.mimeType || null,
        aspectRatio: asset.aspectRatio || null,
        width: asset.width || null,
        height: asset.height || null,
        provider: asset.provider || null,
      },
      plannedFiles: preview.files.filter((file) => file.assetId === asset._id).map((file) => ({
        fileName: file.fileName,
        variantKey: file.variantKey,
        target: file.target,
      })),
      masterFileName: buildMasterFileName(pack, asset, assetIndex + 1),
    })),
  };
}

export async function buildExportPackageZip(pack: ExportPackLike) {
  const manifest = buildExportManifest(pack);
  const files: Array<{ name: string; bytes: Uint8Array }> = [
    {
      name: "manifest.json",
      bytes: new TextEncoder().encode(JSON.stringify(manifest, null, 2)),
    },
    {
      name: "README.txt",
      bytes: new TextEncoder().encode(buildReadme(pack, manifest.bundle.targets)),
    },
  ];

  for (let index = 0; index < pack.assets.length; index += 1) {
    const asset = pack.assets[index];
    if (!asset.publicUrl) {
      continue;
    }

    const response = await fetch(asset.publicUrl);
    if (!response.ok) {
      continue;
    }

    const bytes = new Uint8Array(await response.arrayBuffer());
    files.push({
      name: `masters/${buildMasterFileName(pack, asset, index + 1)}`,
      bytes,
    });
  }

  return createStoredZip(files);
}

function buildReadme(pack: ExportPackLike, targets: DeliveryFormatTarget[]) {
  return [
    `${pack.name}`,
    "",
    `Platform: ${pack.platform}`,
    `Locale: ${pack.locale}`,
    `Target bundle: ${getDeliveryBundle(pack.deliveryBundleKey).name}`,
    "",
    "This package contains:",
    "- master assets as currently generated",
    "- manifest.json with filename plan and target delivery specs",
    "",
    "Bundle targets:",
    ...targets.map(
      (target) =>
        `- ${target.label}: ${target.width}x${target.height} (${target.aspectRatio}) .${target.extension}`,
    ),
  ].join("\n");
}

function buildMasterFileName(
  pack: ExportPackLike,
  asset: ExportAssetLike,
  assetIndex: number,
) {
  const extension = inferExtension(asset);
  return buildDeliveryFileName({
    template: pack.fileNameTemplate,
    campaignName: pack.campaignName || pack.name,
    platform: pack.platform,
    locale: pack.locale,
    objective: pack.objective,
    presetName: pack.templatePresetName,
    variantKey: asset.aspectRatio ? `master-${asset.aspectRatio.replace(":", "x")}` : "master",
    assetIndex,
    extension,
  });
}

function inferExtension(asset: ExportAssetLike) {
  if (asset.mimeType?.includes("png")) {
    return "png";
  }
  if (asset.mimeType?.includes("webp")) {
    return "webp";
  }
  if (asset.publicUrl) {
    const match = asset.publicUrl.match(/\.([a-z0-9]+)(?:\?|$)/i);
    if (match?.[1]) {
      return match[1].toLowerCase();
    }
  }
  return "jpg";
}

function createStoredZip(files: Array<{ name: string; bytes: Uint8Array }>) {
  const localHeaders: Buffer[] = [];
  const centralDirectory: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = Buffer.from(file.name, "utf8");
    const data = Buffer.from(file.bytes);
    const crc = crc32(data);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(data.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(nameBytes.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localHeaders.push(localHeader, nameBytes, data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(data.length, 20);
    centralHeader.writeUInt32LE(data.length, 24);
    centralHeader.writeUInt16LE(nameBytes.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    centralDirectory.push(centralHeader, nameBytes);

    offset += localHeader.length + nameBytes.length + data.length;
  }

  const centralSize = centralDirectory.reduce((sum, part) => sum + part.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...localHeaders, ...centralDirectory, end]);
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let index = 0; index < 8; index += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
