# Prompt System

Date: March 21, 2026

## Goal

The app should build structured internal prompt specs first, then render provider-specific prompt strings for Gemini, OpenAI, and Seedream.

This avoids one oversized freeform prompt and lets the system adapt to different generation modes without rewriting the app for each model.

## Supported Use Cases

- `product-highlight`
  - still-life product hero images
  - clean ecommerce product storytelling
  - product-first awareness and sales assets
- `try-on`
  - eyewear placed naturally on a model
  - identity-preserving model edits
  - fit-led campaign imagery
- `persona-editorial`
  - model-led campaign visuals
  - persona-specific fashion direction
  - product plus character-driven storytelling

## Internal Prompt Spec

Defined in [prompt-system.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/lib/prompt-system.ts).

Core fields:

- `goal`
- `deliverableType`
- `useCase`
- `platform`
- `objective`
- `locale`
- `aspectRatio`
- `imageSize`
- `size`
- `subject`
- `productFocus`
- `setting`
- `actionOrPose`
- `composition`
- `lighting`
- `style`
- `brandTone`
- `textOverlay`
- `constraints`
- `negativeAvoidance`
- `references`
- `persona`
- `editInstructions`

## Provider Rendering Strategy

### Gemini

Gemini gets the richest natural-language prompt. The renderer keeps explicit sections for:

- subject
- products
- setting
- pose or action
- composition
- lighting
- style
- tone
- text overlay
- constraints

This fits Gemini’s strong support for structured visual direction, multi-image context, and iterative prompt refinement.

### OpenAI

OpenAI gets a more labeled instruction format with separate blocks for:

- task
- scene
- subject
- product focus
- composition
- style
- brand tone
- text
- constraints
- preserve/change rules

This is the best fit for brand-sensitive output, text accuracy, and controlled edits.

### Seedream

Seedream gets a shorter, denser prompt with the highest-priority terms first:

- subject
- product descriptors
- setting
- pose
- style
- lighting
- core composition
- top constraints
- avoid terms

This follows the model guidance that shorter and more front-loaded prompts perform better.

## Current Integration

The generation flow now:

1. reads campaign and product context
2. optionally reads a selected persona profile
3. builds the internal prompt spec
4. stores prompt metadata with the generation job
5. renders a provider-specific prompt
6. sends the rendered prompt to the selected model

For persona-editorial generations, the generated asset can become the persona reference image automatically so that later try-on flows have a reusable visual anchor.

Files:

- [campaigns.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/lib/campaigns.ts)
- [prompt-system.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/lib/prompt-system.ts)
- [generation-workflow.ts](/Users/biatyraymond/Documents/Campaign_Studio/src/lib/generation-workflow.ts)

## Next Prompt-System Steps

- add UI selection for `useCase` during campaign creation
- add structured text overlay controls
- add explicit edit flows for try-on and background replacement
- persist the full internal prompt spec with generation jobs for auditability

## Source Guides

- [Gemini image prompt guide](https://deepmind.google/models/gemini-image/prompt-guide/)
- [OpenAI gpt-image-1.5 prompting guide](https://developers.openai.com/cookbook/examples/multimodal/image-gen-1.5-prompting_guide)
- [Microsoft image prompting guide](https://www.microsoft.com/en-us/microsoft-copilot/for-individuals/do-more-with-ai/ai-art-prompting-guide/image-prompting-101?form=MA13Q6)
- [Seedream v4.5 prompt guide](https://fal.ai/learn/devs/seedream-v4-5-prompt-guide)
