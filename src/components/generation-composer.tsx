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
          className="relative w-full max-w-[980px] rounded-[30px] border border-white/7 bg-[rgba(15,17,16,0.96)] p-3 shadow-[0_26px_80px_rgba(0,0,0,0.46)] backdrop-blur-xl"
        >
          <input type="hidden" name="campaignId" value={campaignId} />
          <input type="hidden" name="provider" value={provider} />
          <input type="hidden" name="useCase" value={useCase} />
          <input type="hidden" name="model" value={model} />
          <input type="hidden" name="aspectRatio" value={aspectRatio} />
          <input type="hidden" name="imageSize" value={imageSize} />
          <input type="hidden" name="size" value={size} />
          <input type="hidden" name="personaId" value={personaId} />

          <div className="grid gap-3 lg:grid-cols-[112px_minmax(0,1fr)_auto] lg:items-end">
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-[84px] items-center justify-center rounded-[18px] border border-white/8 bg-black/14 text-3xl text-white/70 transition hover:border-white/14 hover:text-white"
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
                className="rounded-full border border-white/8 bg-white/[0.025] px-4 py-2 text-sm font-medium text-white/82 transition hover:border-white/14 hover:bg-white/[0.05]"
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
                className="min-h-[80px] w-full resize-none rounded-[20px] border border-white/7 bg-black/8 px-5 py-3 text-[17px] leading-7 text-white outline-none placeholder:text-white/24"
              />
              <div className="flex flex-wrap items-center gap-2 text-sm text-white/62">
                <span className="rounded-full border border-white/7 bg-white/[0.03] px-3 py-2 text-white/70">
                  {summaryLabel}
                </span>
                {personaName ? (
                  <span className="rounded-full border border-[rgba(58,147,122,0.45)] bg-[rgba(31,102,86,0.14)] px-3 py-2 text-white/70">
                    {personaName}
                  </span>
                ) : null}
                {files.length > 0 ? (
                  <span className="rounded-full border border-white/7 bg-white/[0.02] px-3 py-2 text-white/40">
                    {files.length} reference{files.length > 1 ? "s" : ""}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="flex h-15 min-w-[108px] items-center justify-center gap-2 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 text-sm font-medium text-white/80 transition hover:border-white/14 hover:bg-white/[0.05]"
              >
                <SlidersIcon />
                <span className="text-xs tracking-[0.08em] text-white/44">
                  Settings
                </span>
              </button>
              <SubmitButton />
            </div>
          </div>

          {settingsOpen ? (
            <div className="absolute bottom-[calc(100%+18px)] left-1/2 w-full max-w-[960px] -translate-x-1/2 rounded-[32px] border border-white/7 bg-[rgba(14,15,15,0.98)] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.58)]">
              <div className="flex items-center justify-between gap-3 pb-4">
                <div className="text-2xl font-semibold text-white">Settings</div>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-full border border-white/8 px-4 py-2 text-sm text-white/62 transition hover:border-white/14 hover:text-white"
                >
                  Done
                </button>
              </div>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_360px]">
                <div className="min-w-0 rounded-[26px] border border-white/6 bg-white/[0.018] p-4">
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
                          className={`rounded-[20px] border px-4 py-4 text-left transition ${
                            active
                              ? "border-[rgba(254,104,22,0.55)] bg-[rgba(254,104,22,0.08)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                              : "border-white/7 bg-black/12 text-white/72 hover:border-white/14"
                          }`}
                        >
                          <div className="text-base font-semibold">{card.label}</div>
                          <div className="mt-2 text-[11px] leading-5 text-white/34">{card.detail}</div>
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
      className="h-15 min-w-[160px] rounded-[20px] bg-[var(--color-orange)] px-6 text-lg font-semibold text-white shadow-[0_20px_46px_rgba(254,104,22,0.28)] transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
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
    <div className="rounded-[28px] border border-white/6 bg-white/[0.018] p-4">
      <div className="text-sm font-semibold text-white/92">{title}</div>
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

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
      <path d="M4 6h16" />
      <path d="M4 18h16" />
      <path d="M8 6v8" />
      <path d="M16 10v8" />
    </svg>
  );
}
