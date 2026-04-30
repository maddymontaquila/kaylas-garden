import { NextResponse } from "next/server";
import { getGardenConfig } from "@/lib/config";

export function GET(): NextResponse {
  return NextResponse.json(getGardenConfig());
}
