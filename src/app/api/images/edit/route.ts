import { NextResponse } from "next/server";
import { editImage, editImageSchema } from "@/lib/image-providers";

export async function POST(request: Request) {
  try {
    const payload = editImageSchema.parse(await request.json());
    const result = await editImage(payload);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
