import { NextResponse } from "next/server";
import { getImageProviderStatuses } from "@/lib/image-providers";

export async function GET() {
  return NextResponse.json({
    providers: getImageProviderStatuses(),
  });
}
