"use client";

import { useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { generateCampaignImageAction } from "@/app/campaigns/actions";
import { getGeminiImageModels } from "@/lib/image-providers";
import { promptUseCaseOptions } from "@/lib/prompt-system";

type PersonaOption = {
  id: string;
  name: string;
};

export function GenerationComposer({
  campaignId,
  defaultHook,
  defaultAspectRatio,
  defaultImageSize,
  personas,
  geminiAspectRatios,
  geminiImageSizes,
  openAiSizes,
  seedreamSizes,
}: {
  campaignId: string;
  defaultHook?: string;
  defaultAspectRatio: string;
  defaultImageSize: string;
  personas: PersonaOption[];
  geminiAspectRatios: readonly string[];
  geminiImageSizes: readonly string[];
  openAiSizes: readonly string[];
  seedreamSizes: readonly string[];
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [provider, setProvider] = useState<"gemini" | "openai" | "seedream">("gemini");
  const [useCase, setUseCase] =
    useState<(typeof promptUseCaseOptions)[number]>("product-highlight");
  const [model, setModel] = useState("");
  const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio);
  const [imageSize, setImageSize] = useState(defaultImageSize);
  const [size, setSize] = useState("");
  const [personaId, setPersonaId] = useState("");
  const [direction, setDirection] = useState(defaultHook || "");
  const [files, setFiles] = useState<File[]>([]);

  const providerCards = useMemo(
    () => [
      {
        id: "gemini",
        label: "Nano Banana",
        detail: getGeminiImageModels().join(", "),
      },
      {
        id: "openai",
        label: "GPT Image",
        detail: "gpt-image-1.5",
      },
      {
        id: "seedream",
        label: "Seedream",
        detail: "seedream-4-5-251128",
      },
    ],
    [],
  );

  const personaName = personas.find((persona) => persona.id === personaId)?.name;
  const summaryLabel = [
    provider === "gemini" ? "Nano Banana" : provider === "openai" ? "GPT Image" : "Seedream",
    aspectRatio,
    personaName ? `Persona: ${personaName}` : null,
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <>
      {settingsOpen ? (
        <div className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm" onClick={() => setSettingsOpen(false)} />
      ) : null}

      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
        <form
          action={generateCampaignImageAction}
          className="relative w-full max-w-[1020px] rounded-[32px] border border-white/7 bg-[rgba(16,18,17,0.96)] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          <input type="hidden" name="campaignId" value={campaignId} />
          <input type="hidden" name="provider" value={provider} />
          <input type="hidden" name="useCase" value={useCase} />
          <input type="hidden" name="model" value={model} />
          <input type="hidden" name="aspectRatio" value={aspectRatio} />
          <input type="hidden" name="imageSize" value={imageSize} />
          <input type="hidden" name="size" value={size} />
          <input type="hidden" name="personaId" value={personaId} />

          <div className="grid gap-4 lg:grid-cols-[128px_minmax(0,1fr)_auto] lg:items-end">
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-[92px] items-center justify-center rounded-[20px] border border-white/8 bg-black/16 text-3xl text-white/72 transition hover:border-white/14 hover:text-white"
              >
                +
              </button>
              <input
                ref={fileInputRef}
                type="file"
                name="referenceFiles"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) =>
                  setFiles(Array.from(event.currentTarget.files ?? []).slice(0, 3))
                }
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/88 transition hover:border-white/14 hover:bg-white/[0.05]"
              >
                {files.length > 0 ? `${files.length} image${files.length > 1 ? "s" : ""}` : "Add image"}
              </button>
            </div>

            <div className="grid gap-3">
              <textarea
                name="direction"
                rows={2}
                value={direction}
                onChange={(event) => setDirection(event.currentTarget.value)}
                placeholder="Describe the image you want to create."
                className="min-h-[88px] w-full resize-none rounded-[22px] border border-white/8 bg-black/10 px-4 py-3 text-lg leading-7 text-white outline-none placeholder:text-white/28"
              />
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/62">
                <span className="rounded-full border border-white/8 px-3 py-2">{summaryLabel}</span>
                {files.length > 0 ? (
                  <span className="rounded-full border border-white/8 px-3 py-2 text-white/44">
                    {files.map((file) => file.name).join(", ")}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="flex h-16 min-w-[96px] flex-col items-center justify-center rounded-[20px] border border-white/8 bg-white/[0.03] px-4 text-sm font-medium text-white/84 transition hover:border-white/14 hover:bg-white/[0.05]"
              >
                <span className="text-lg">@</span>
                <span className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/40">
                  Settings
                </span>
              </button>
              <SubmitButton />
            </div>
          </div>

          {settingsOpen ? (
            <div className="absolute bottom-[calc(100%+18px)] left-1/2 w-full max-w-[1020px] -translate-x-1/2 rounded-[34px] border border-white/7 bg-[rgba(14,15,15,0.98)] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.58)]">
              <div className="flex items-center justify-between gap-3 pb-4">
                <div className="text-2xl font-semibold text-white">Settings</div>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-full border border-white/8 px-3 py-1 text-sm text-white/56 transition hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_360px]">
                <div className="min-w-0 rounded-[28px] border border-white/6 bg-white/[0.02] p-4">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/34">
                      Providers
                    </span>
                    <span className="rounded-full border border-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/34">
                      Models
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {providerCards.map((card) => {
                      const active = provider === card.id;
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() =>
                            setProvider(card.id as "gemini" | "openai" | "seedream")
                          }
                          className={`rounded-[22px] border px-4 py-4 text-left transition ${
                            active
                              ? "border-white/40 bg-white/[0.06] text-white"
                              : "border-white/7 bg-black/12 text-white/72 hover:border-white/14"
                          }`}
                        >
                          <div className="text-lg font-semibold">{card.label}</div>
                          <div className="mt-2 text-xs leading-5 text-white/38">{card.detail}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4">
                  <SettingsBlock title="Image setup">
                    <SettingsField label="Use case">
                      <select
                        value={useCase}
                        onChange={(event) =>
                          setUseCase(event.currentTarget.value as (typeof promptUseCaseOptions)[number])
                        }
                        className="h-11 rounded-[16px] border border-white/8 bg-black/18 px-3 text-sm text-white outline-none"
                      >
                        {promptUseCaseOptions.map((option) => (
                          <option key={option} value={option} className="bg-[var(--color-panel)]">
                            {option}
                          </option>
                        ))}
                      </select>
                    </SettingsField>

                    <SettingsField label="Persona">
                      <select
                        value={personaId}
                        onChange={(event) => setPersonaId(event.currentTarget.value)}
                        className="h-11 rounded-[16px] border border-white/8 bg-black/18 px-3 text-sm text-white outline-none"
                      >
                        <option value="" className="bg-[var(--color-panel)]">
                          No persona
                        </option>
                        {personas.map((persona) => (
                          <option key={persona.id} value={persona.id} className="bg-[var(--color-panel)]">
                            {persona.name}
                          </option>
                        ))}
                      </select>
                    </SettingsField>

                    <SettingsField label="Model override">
                      <input
                        value={model}
                        onChange={(event) => setModel(event.currentTarget.value)}
                        placeholder={provider === "gemini" ? getGeminiImageModels()[0] : provider === "openai" ? "gpt-image-1.5" : "seedream-4-5-251128"}
                        className="h-11 rounded-[16px] border border-white/8 bg-black/18 px-3 text-sm text-white outline-none"
                      />
                    </SettingsField>
                  </SettingsBlock>

                  <SettingsBlock title="Format">
                    <SettingsField label="Aspect ratio">
                      <select
                        value={aspectRatio}
                        onChange={(event) => setAspectRatio(event.currentTarget.value)}
                        className="h-11 rounded-[16px] border border-white/8 bg-black/18 px-3 text-sm text-white outline-none"
                      >
                        {geminiAspectRatios.map((ratio) => (
                          <option key={ratio} value={ratio} className="bg-[var(--color-panel)]">
                            {ratio}
                          </option>
                        ))}
                      </select>
                    </SettingsField>

                    <SettingsField label="Gemini resolution">
                      <div className="flex flex-wrap gap-2">
                        {geminiImageSizes.map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setImageSize(value)}
                            className={`rounded-full border px-3 py-2 text-sm transition ${
                              imageSize === value
                                ? "border-white/20 bg-white/[0.08] text-white"
                                : "border-white/8 text-white/52"
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </SettingsField>

                    <SettingsField label="Pixel size override">
                      <input
                        value={size}
                        onChange={(event) => setSize(event.currentTarget.value)}
                        placeholder={`${openAiSizes[0]} or ${seedreamSizes[0]}`}
                        className="h-11 rounded-[16px] border border-white/8 bg-black/18 px-3 text-sm text-white outline-none"
                      />
                    </SettingsField>
                  </SettingsBlock>
                </div>
              </div>
            </div>
          ) : null}
        </form>
      </div>
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-16 min-w-[168px] rounded-[22px] bg-[linear-gradient(135deg,#7c4dff,#915eff)] px-6 text-lg font-semibold text-white shadow-[0_24px_54px_rgba(124,77,255,0.35)] transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Creating..." : "Create"}
    </button>
  );
}

function SettingsBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-white/6 bg-white/[0.02] p-4">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-4 grid gap-4">{children}</div>
    </div>
  );
}

function SettingsField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-white/46">{label}</span>
      {children}
    </label>
  );
}
