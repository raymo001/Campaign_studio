import { getExportPackFromConvex } from "@/lib/convex-server";
import { buildExportPackageZip } from "@/lib/export-packaging";

export async function GET(
  _request: Request,
  context: RouteContext<"/exports/[exportPackId]/download">,
) {
  const { exportPackId } = await context.params;
  const pack = await getExportPackFromConvex(exportPackId);

  if (!pack) {
    return new Response("Export pack not found.", { status: 404 });
  }

  const zip = await buildExportPackageZip({
    ...pack,
    campaignName: pack.campaignName,
    templatePresetName: pack.templatePresetName,
  });

  const safeName = pack.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "export-pack";

  return new Response(zip, {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${safeName}.zip"`,
      "cache-control": "no-store",
    },
  });
}
