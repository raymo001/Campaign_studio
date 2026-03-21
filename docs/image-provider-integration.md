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
- Seedream generation uses the configured model string directly and falls back between two LAS endpoint shapes because the current docs show both `/api/v1/images/generations` and `/api/v1/online/images/generations`.
- Volcengine's current public docs show the documented Seedream 4.5 model id as `doubao-seedream-4-5-251128`. If your configured `seedream-4-5-251128` string is rejected by the API, switch the env value to the documented id.

## Sources

- Gemini image generation: https://ai.google.dev/gemini-api/docs/image-generation
- OpenAI image generation guide: https://platform.openai.com/docs/guides/image-generation
- Volcengine Seedream image generation: https://www.volcengine.com/docs/6492/2172373?lang=zh
