# Image Provider Integration

Date: March 21, 2026

## Integrated Providers

- Gemini image generation via `GEMINI_API_KEY` and `GEMINI_IMAGE_MODEL`
- OpenAI image generation and edits via `OPENAI_API_KEY` and `OPENAI_IMAGE_MODEL`
- Seedream image generation via `ARK_API_KEY` and `SEEDREAM_IMAGE_MODEL`

## Gemini Model Options

The Gemini provider now exposes both of the current Nano Banana preview image models:

- Nano Banana 2: `gemini-3.1-flash-image-preview`
- Nano Banana Pro: `gemini-3-pro-image-preview`

You can control the Gemini catalog with:

- `GEMINI_IMAGE_MODEL`
- `GEMINI_IMAGE_MODELS`

## Server Routes

- `GET /api/image-providers`
- `POST /api/images/generate`
- `POST /api/images/edit`

## Request Shapes

### `POST /api/images/generate`

```json
{
  "provider": "gemini",
  "model": "gemini-3-pro-image-preview",
  "prompt": "Luxury editorial product shot of black acetate sunglasses on stone",
  "aspectRatio": "4:5",
  "imageSize": "2K"
}
```

```json
{
  "provider": "openai",
  "prompt": "Minimal ecommerce hero image for Vanpella sunglasses",
  "size": "1536x1024",
  "quality": "high",
  "background": "transparent"
}
```

```json
{
  "provider": "seedream",
  "prompt": "Quiet-luxury studio image of tortoise shell sunglasses",
  "size": "2048x2048"
}
```

### `POST /api/images/edit`

```json
{
  "prompt": "Replace the background with soft travertine and warm daylight",
  "image": "data:image/png;base64,...",
  "mask": "data:image/png;base64,..."
}
```

## Notes

- OpenAI edits are wired only for OpenAI because that is the provider you explicitly asked to support for editing.
- Gemini generation supports explicit model selection per request and optional reference images.
- Seedream generation now follows the BytePlus ModelArk OpenAI-compatible base URL shape: `https://ark.ap-southeast.bytepluses.com/api/v3/images/generations`.
- BytePlus documents that `model` can be an endpoint ID or a model ID. If `seedream-4-5-251128` is rejected, use the deployed endpoint ID or the exact model ID from your BytePlus console.

### Seedream 4.5 validated size matrix

The Seedream integration now validates against the supported sizes you provided:

- 2K
  - `2048x2048` `1:1`
  - `2304x1728` `4:3`
  - `1728x2304` `3:4`
  - `2848x1600` `16:9`
  - `1600x2848` `9:16`
  - `2496x1664` `3:2`
  - `1664x2496` `2:3`
  - `3136x1344` `21:9`
- 4K
  - `4096x4096` `1:1`
  - `3520x4704` `3:4`
  - `4704x3520` `4:3`
  - `5504x3040` `16:9`
  - `3040x5504` `9:16`
  - `3328x4992` `2:3`
  - `4992x3328` `3:2`
  - `6240x2656` `21:9`

## Sources

- Gemini image generation: https://ai.google.dev/gemini-api/docs/image-generation
- OpenAI image generation guide: https://platform.openai.com/docs/guides/image-generation
- BytePlus image generation API: https://docs.byteplus.com/en/docs/ModelArk/1541523
- BytePlus OpenAI compatibility: https://docs.byteplus.com/en/docs/ModelArk/1330626
