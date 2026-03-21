# Image Provider Integration

Date: March 21, 2026

## Integrated Providers

- Gemini image generation via `GEMINI_API_KEY` and `GEMINI_IMAGE_MODEL`
- OpenAI image generation and edits via `OPENAI_API_KEY` and `OPENAI_IMAGE_MODEL`
- Seedream image generation via `ARK_API_KEY` and `SEEDREAM_IMAGE_MODEL`

## Server Routes

- `GET /api/image-providers`
- `POST /api/images/generate`
- `POST /api/images/edit`

## Request Shapes

### `POST /api/images/generate`

```json
{
  "provider": "gemini",
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
- Gemini generation uses the configured model string directly and supports optional reference images.
- Seedream generation now follows the BytePlus ModelArk OpenAI-compatible base URL shape: `https://ark.ap-southeast.bytepluses.com/api/v3/images/generations`.
- BytePlus documents that `model` can be an endpoint ID or a model ID. If `seedream-4-5-251128` is rejected, use the deployed endpoint ID or the exact model ID from your BytePlus console.

## Sources

- Gemini image generation: https://ai.google.dev/gemini-api/docs/image-generation
- OpenAI image generation guide: https://platform.openai.com/docs/guides/image-generation
- BytePlus image generation API: https://docs.byteplus.com/en/docs/ModelArk/1541523
- BytePlus OpenAI compatibility: https://docs.byteplus.com/en/docs/ModelArk/1330626
