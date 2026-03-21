import type { ImageProviderId } from "@/lib/image-providers";
import type { NormalizedProduct } from "@/lib/feed";

export const promptUseCaseOptions = [
  "product-highlight",
  "try-on",
  "persona-editorial",
] as const;

export type PromptUseCase = (typeof promptUseCaseOptions)[number];

type PromptProduct = Pick<
  NormalizedProduct,
  | "sku"
  | "name"
  | "brand"
  | "collection"
  | "referenceImages"
  | "productImages"
  | "tryOnImages"
  | "descriptions"
  | "promptContext"
>;

export type PromptReferenceImage = {
  kind: "product" | "try-on" | "persona" | "style";
  url?: string;
};

export type InternalPromptSpec = {
  goal: string;
  deliverableType: "image" | "video-frame";
  useCase: PromptUseCase;
  platform: string;
  objective: string;
  locale: string;
  aspectRatio?: string;
  imageSize?: string;
  size?: string;
  subject: string;
  productFocus: string[];
  setting: string;
  actionOrPose: string;
  composition: string[];
  lighting: string;
  style: string[];
  brandTone: string[];
  textOverlay?: {
    headline?: string;
    body?: string;
    cta?: string;
    legal?: string;
  };
  constraints: string[];
  negativeAvoidance: string[];
  references: PromptReferenceImage[];
  editInstructions?: {
    change: string[];
    preserve: string[];
  };
};

export function buildInternalPromptSpec(args: {
  campaign: {
    objective: string;
    primaryPlatform: string;
    locale: string;
    audienceAngle?: string;
  };
  brief: {
    proposition: string;
    audienceAngle: string;
    copyDirection: {
      hook?: string;
      bodyCopy?: string;
      callToAction?: string;
    };
    creativeDirection: {
      visualStyle?: string;
      compositionRules?: string[];
      lighting?: string;
    };
  };
  products: PromptProduct[];
  useCase?: PromptUseCase;
  aspectRatio?: string;
  imageSize?: string;
  size?: string;
}) {
  const useCase = args.useCase ?? "product-highlight";
  const leadProduct = args.products[0];
  const productFocus = args.products.map(buildProductDescriptor);

  const spec: InternalPromptSpec = {
    goal: args.brief.proposition,
    deliverableType: "image",
    useCase,
    platform: args.campaign.primaryPlatform,
    objective: args.campaign.objective,
    locale: args.campaign.locale,
    aspectRatio: args.aspectRatio,
    imageSize: args.imageSize,
    size: args.size,
    subject: buildSubject(useCase, args.products),
    productFocus,
    setting: buildSetting(useCase),
    actionOrPose: buildActionOrPose(useCase),
    composition: [
      ...(args.brief.creativeDirection.compositionRules ?? []),
      ...buildUseCaseComposition(useCase),
    ],
    lighting:
      args.brief.creativeDirection.lighting ||
      "Soft natural light or controlled studio light.",
    style: uniqueValues([
      args.brief.creativeDirection.visualStyle,
      ...buildUseCaseStyle(useCase),
    ]),
    brandTone: uniqueValues([
      args.campaign.audienceAngle,
      leadProduct?.descriptions.socialCaption,
      "Premium, precise, elevated, product-led.",
    ]),
    textOverlay: {
      headline: args.brief.copyDirection.hook,
      body: args.brief.copyDirection.bodyCopy,
      cta: args.brief.copyDirection.callToAction,
    },
    constraints: buildConstraints(useCase),
    negativeAvoidance: buildNegativeAvoidance(useCase),
    references: buildReferences(useCase, args.products),
  };

  if (useCase === "try-on" || useCase === "persona-editorial") {
    spec.editInstructions = {
      change:
        useCase === "try-on"
          ? ["Place the featured eyewear on the model naturally and proportionally."]
          : ["Create a model-led campaign visual around the product and persona brief."],
      preserve:
        useCase === "try-on"
          ? ["Preserve identity, facial proportions, skin tone, and pose."]
          : ["Preserve product silhouette, materials, and brand cues."],
    };
  }

  return spec;
}

export function renderPromptForProvider(provider: ImageProviderId, spec: InternalPromptSpec) {
  switch (provider) {
    case "gemini":
      return renderGeminiPrompt(spec);
    case "openai":
      return renderOpenAiPrompt(spec);
    case "seedream":
      return renderSeedreamPrompt(spec);
  }
}

function renderGeminiPrompt(spec: InternalPromptSpec) {
  return [
    `Create a ${spec.deliverableType} for ${spec.platform}.`,
    `Use case: ${spec.useCase}.`,
    `Goal: ${spec.goal}.`,
    `Subject: ${spec.subject}.`,
    `Featured products: ${spec.productFocus.join("; ")}.`,
    `Setting: ${spec.setting}.`,
    `Action or pose: ${spec.actionOrPose}.`,
    `Composition: ${spec.composition.join(" ")}.`,
    `Lighting: ${spec.lighting}.`,
    `Style: ${spec.style.join(" ")}.`,
    `Brand tone: ${spec.brandTone.join(" ")}.`,
    spec.textOverlay?.headline ? `Headline text: ${spec.textOverlay.headline}.` : undefined,
    spec.textOverlay?.cta ? `CTA text: ${spec.textOverlay.cta}.` : undefined,
    spec.aspectRatio ? `Aspect ratio: ${spec.aspectRatio}.` : undefined,
    spec.imageSize ? `Resolution: ${spec.imageSize}.` : undefined,
    `Constraints: ${spec.constraints.join(" ")}.`,
    `Avoid: ${spec.negativeAvoidance.join(" ")}.`,
  ]
    .filter(Boolean)
    .join(" ");
}

function renderOpenAiPrompt(spec: InternalPromptSpec) {
  return [
    `Task: Create a ${spec.deliverableType} for ${spec.platform}.`,
    `Use case: ${spec.useCase}.`,
    `Objective: ${spec.objective}.`,
    `Scene: ${spec.setting}.`,
    `Subject: ${spec.subject}.`,
    `Product focus: ${spec.productFocus.join("; ")}.`,
    `Action/Pose: ${spec.actionOrPose}.`,
    `Composition: ${spec.composition.join(" ")}.`,
    `Lighting: ${spec.lighting}.`,
    `Style: ${spec.style.join(" ")}.`,
    `Brand tone: ${spec.brandTone.join(" ")}.`,
    spec.textOverlay?.headline ? `Text headline: ${spec.textOverlay.headline}.` : undefined,
    spec.textOverlay?.body ? `Text body: ${spec.textOverlay.body}.` : undefined,
    spec.textOverlay?.cta ? `Text CTA: ${spec.textOverlay.cta}.` : undefined,
    `Constraints: ${spec.constraints.join(" ")}.`,
    `Do not: ${spec.negativeAvoidance.join(" ")}.`,
    spec.editInstructions
      ? `If editing, change only: ${spec.editInstructions.change.join(" ")} Preserve: ${spec.editInstructions.preserve.join(" ")}.`
      : undefined,
  ]
    .filter(Boolean)
    .join("\n");
}

function renderSeedreamPrompt(spec: InternalPromptSpec) {
  return [
    spec.subject,
    spec.productFocus.join("; "),
    spec.setting,
    spec.actionOrPose,
    spec.style.slice(0, 3).join(", "),
    spec.lighting,
    spec.composition.slice(0, 3).join(" "),
    spec.constraints.slice(0, 4).join(" "),
    `avoid ${spec.negativeAvoidance.slice(0, 5).join(", ")}`,
  ]
    .filter(Boolean)
    .join(". ");
}

function buildSubject(useCase: PromptUseCase, products: PromptProduct[]) {
  const productNames = products.map((product) => product.name).join(", ");

  switch (useCase) {
    case "try-on":
      return `A realistic model wearing ${productNames}`;
    case "persona-editorial":
      return `A persona-led fashion image featuring ${productNames}`;
    case "product-highlight":
    default:
      return `A clean product-led campaign image featuring ${productNames}`;
  }
}

function buildSetting(useCase: PromptUseCase) {
  switch (useCase) {
    case "try-on":
      return "A clean portrait setting with premium styling and minimal distraction";
    case "persona-editorial":
      return "An editorial environment aligned with premium eyewear storytelling";
    case "product-highlight":
    default:
      return "A minimal studio or refined premium environment";
  }
}

function buildActionOrPose(useCase: PromptUseCase) {
  switch (useCase) {
    case "try-on":
      return "Natural eyewear fit on face, realistic posture, calm expression";
    case "persona-editorial":
      return "Confident editorial pose with clear product visibility";
    case "product-highlight":
    default:
      return "Hero framing with clear product silhouette and detail";
  }
}

function buildUseCaseComposition(useCase: PromptUseCase) {
  switch (useCase) {
    case "try-on":
      return [
        "Keep the face and eyewear aligned naturally.",
        "Do not crop out key fit points around the eyes, brow, and temples.",
      ];
    case "persona-editorial":
      return [
        "Balance product legibility with model presence.",
        "Keep the frame readable in the hero shot.",
      ];
    case "product-highlight":
    default:
      return [
        "Keep the product dominant in frame.",
        "Use close crop or premium still-life composition.",
      ];
  }
}

function buildUseCaseStyle(useCase: PromptUseCase) {
  switch (useCase) {
    case "try-on":
      return ["Realistic skin rendering.", "Natural facial proportions."];
    case "persona-editorial":
      return ["Elevated editorial fashion image.", "Refined premium styling."];
    case "product-highlight":
    default:
      return ["Premium ecommerce still life.", "Controlled luxury minimalism."];
  }
}

function buildConstraints(useCase: PromptUseCase) {
  const base = [
    "Preserve product geometry and silhouette.",
    "Preserve material and color accuracy.",
    "Keep branding premium and restrained.",
    "Do not invent extra products or accessories.",
  ];

  if (useCase === "try-on") {
    return [
      ...base,
      "Eyewear fit must look physically plausible on the face.",
      "Identity and facial structure must remain stable.",
    ];
  }

  return base;
}

function buildNegativeAvoidance(useCase: PromptUseCase) {
  const base = [
    "distorted eyewear geometry",
    "extra limbs",
    "warped face",
    "busy background",
    "cheap sales graphics",
    "incorrect text",
  ];

  if (useCase === "product-highlight") {
    return [...base, "low-detail product edges", "cluttered props"];
  }

  if (useCase === "try-on") {
    return [...base, "misaligned glasses fit", "identity drift"];
  }

  return [...base, "generic stock-photo styling"];
}

function buildReferences(useCase: PromptUseCase, products: PromptProduct[]) {
  const references: PromptReferenceImage[] = [];

  for (const product of products) {
    const productImage = product.referenceImages[0] || product.productImages[0];
    if (productImage) {
      references.push({ kind: "product", url: productImage });
    }
    if (useCase === "try-on" && product.tryOnImages[0]) {
      references.push({ kind: "try-on", url: product.tryOnImages[0] });
    }
  }

  return references.slice(0, 4);
}

function buildProductDescriptor(product: PromptProduct) {
  return uniqueValues([
    product.name,
    product.promptContext.frameMaterial,
    product.promptContext.frameShape,
    product.promptContext.frameColor,
    product.promptContext.lensColor,
  ]).join(", ");
}

function uniqueValues(values: Array<string | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}
