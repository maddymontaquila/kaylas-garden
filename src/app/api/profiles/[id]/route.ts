import { NextRequest, NextResponse } from "next/server";
import { deleteProfile } from "@/lib/data";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    await deleteProfile(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("DELETE /api/profiles/[id] failed:", err);
    const message = err instanceof Error ? err.message : "Failed to delete profile";
    const status = message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
