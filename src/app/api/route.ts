import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Prepify API is running",
    version: "2.1.0",
    timestamp: new Date().toISOString(),
  });
}
