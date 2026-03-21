import { NextResponse } from "next/server";
import {
  getProductSyncSummary,
  triggerProductSync,
} from "@/lib/convex-server";

export async function GET() {
  try {
    const summary = await getProductSyncSummary();
    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await triggerProductSync();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
