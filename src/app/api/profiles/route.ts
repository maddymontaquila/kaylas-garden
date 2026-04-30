import { NextRequest, NextResponse } from "next/server";
import { createProfile, getProfiles } from "@/lib/data";
import type { Profile } from "@/lib/types";

export async function GET(): Promise<NextResponse> {
  try {
    const profiles = await getProfiles();
    return NextResponse.json(profiles);
  } catch (err: unknown) {
    console.error("GET /api/profiles failed:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch profiles";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as Omit<Profile, "id" | "createdAt">;
    const profile = await createProfile(body);
    return NextResponse.json(profile, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/profiles failed:", err);
    const message = err instanceof Error ? err.message : "Failed to create profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
