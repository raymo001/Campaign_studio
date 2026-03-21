import { createHash } from "node:crypto";

type UnknownRecord = Record<string, unknown>;

export type NormalizedProduct = {
  feedId: string;
  syncHash: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  collection?: string;
  currency?: string;
  retailPrice?: number;
  stockQuantity?: number;
  availabilityStatus?: string;
  isFeatured: boolean;
  defaultLocale?: string;
  supportedLocales: string[];
  categories: string[];
  tags: string[];
  referenceImages: string[];
  portraitImages: string[];
  productImages: string[];
  tryOnImages: string[];
  descriptions: {
    short?: string;
    long?: string;
    socialCaption?: string;
    whyVanpella?: string;
    purchaseNote?: string;
  };
  promptContext: {
    productType?: string;
    productTypeCategory?: string;
    color?: string;
    frameColor?: string;
    frameShape?: string;
    frameMaterial?: string;
    lensColor?: string;
    lensMaterial?: string;
    polarized?: boolean;
    uvProtection?: string;
    gender?: string;
    ageGroup?: string;
  };
  localized: Record<
    string,
    {
      shortDescription?: string;
      description?: string;
      socialCaption?: string;
      whyVanpella?: string;
    }
  >;
  raw: UnknownRecord;
};

export type ProductFeedSnapshot = {
  products: UnknownRecord[];
  defaultLocale?: string;
  supportedLocales: string[];
  exportedAt?: string;
  count: number;
  warnings: string[];
};

function asRecord(value: unknown): UnknownRecord {
  return typeof value === "object" && value !== null ? (value as UnknownRecord) : {};
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalString(value: unknown) {
  const string = asString(value);
  return string || undefined;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asBoolean(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map(asString).filter(Boolean)
    : [];
}

function uniqueStrings(values: Array<string | undefined>) {
  return [...new Set(values.filter(Boolean) as string[])];
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function hashValue(value: unknown) {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  const entries = Object.entries(value as UnknownRecord).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  return `{${entries
    .map(([key, entryValue]) => `${JSON.stringify(key)}:${stableStringify(entryValue)}`)
    .join(",")}}`;
}

export function normalizeFeedSnapshot(payload: unknown): ProductFeedSnapshot {
  const record = asRecord(payload);
  const products = Array.isArray(record.products)
    ? record.products.map(asRecord)
    : [];

  return {
    products,
    defaultLocale: asOptionalString(record.defaultLocale),
    supportedLocales: asStringArray(record.supportedLocales),
    exportedAt: asOptionalString(record.exportedAt),
    count:
      asNumber(record.count) ??
      products.length,
    warnings: asStringArray(record.warnings),
  };
}

export function normalizeProduct(product: unknown): NormalizedProduct {
  const record = asRecord(product);
  const localizedRecord = asRecord(record.localized);
  const sku = asString(record.sku);
  const name = asString(record.name);
  const slugBase = sku || name || asString(record._id) || "product";
  const shortDescription = asOptionalString(record.shortDescription);
  const longDescription = asOptionalString(record.description);
  const socialCaption = asOptionalString(record.socialCaption);
  const whyVanpella = asOptionalString(record.whyVanpella);
  const purchaseNote = asOptionalString(record.purchaseNote);

  const localized = Object.fromEntries(
    Object.entries(localizedRecord).map(([locale, value]) => {
      const entry = asRecord(value);
      return [
        locale,
        {
          shortDescription: asOptionalString(entry.shortDescription),
          description: asOptionalString(entry.description),
          socialCaption: asOptionalString(entry.socialCaption),
          whyVanpella: asOptionalString(entry.whyVanpella),
        },
      ];
    }),
  );

  const referenceImages = asStringArray(record.referenceImageUrls);
  const portraitImages = asStringArray(record.portraitImageUrls);
  const productImages = asStringArray(record.productImages);
  const tryOnImages = uniqueStrings([
    asOptionalString(record.tryOnImage),
    asOptionalString(record.tryOnImage2),
  ]);

  const normalized: NormalizedProduct = {
    feedId: asString(record._id) || sku || slugBase,
    syncHash: "",
    sku,
    slug: slugify(slugBase),
    name,
    brand: asString(record.brand) || "VANPELLA",
    collection: asOptionalString(record.collection),
    currency: asOptionalString(record.currency),
    retailPrice: asNumber(record.retailPrice),
    stockQuantity: asNumber(record.stockQuantity),
    availabilityStatus: asOptionalString(record.availabilityStatus),
    isFeatured: asBoolean(record.isFeatured) ?? false,
    defaultLocale: asOptionalString(record.defaultLocale),
    supportedLocales: asStringArray(record.supportedLocales),
    categories: asStringArray(record.categories),
    tags: asStringArray(record.tags),
    referenceImages,
    portraitImages,
    productImages,
    tryOnImages,
    descriptions: {
      short: shortDescription,
      long: longDescription,
      socialCaption,
      whyVanpella,
      purchaseNote,
    },
    promptContext: {
      productType: asOptionalString(record.productType),
      productTypeCategory: asOptionalString(record.productTypeCategory),
      color: asOptionalString(record.color),
      frameColor: asOptionalString(record.frameColor),
      frameShape: asOptionalString(record.frameShape),
      frameMaterial: asOptionalString(record.frameMaterial),
      lensColor: asOptionalString(record.lensColor),
      lensMaterial: asOptionalString(record.lensMaterial),
      polarized: asBoolean(record.polarized),
      uvProtection: asOptionalString(record.uvProtection),
      gender: asOptionalString(record.gender),
      ageGroup: asOptionalString(record.ageGroup),
    },
    localized,
    raw: record,
  };

  normalized.syncHash = hashValue({
    sku: normalized.sku,
    name: normalized.name,
    currency: normalized.currency,
    retailPrice: normalized.retailPrice,
    stockQuantity: normalized.stockQuantity,
    availabilityStatus: normalized.availabilityStatus,
    descriptions: normalized.descriptions,
    promptContext: normalized.promptContext,
    supportedLocales: normalized.supportedLocales,
    tags: normalized.tags,
    categories: normalized.categories,
    referenceImages: normalized.referenceImages,
    portraitImages: normalized.portraitImages,
    productImages: normalized.productImages,
    tryOnImages: normalized.tryOnImages,
    localized: normalized.localized,
  });

  return normalized;
}

export function normalizeProducts(products: unknown[]) {
  return products.map((product) => normalizeProduct(product));
}
