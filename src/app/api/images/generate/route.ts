import { NextResponse } from "next/server";
import { generateImage, generateImageSchema } from "@/lib/image-providers";

export async function POST(request: Request) {
  try {
    const payload = generateImageSchema.parse(await request.json());
    const result = await generateImage(payload);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
