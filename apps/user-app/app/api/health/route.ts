import { NextResponse } from "next/server";

// Lightweight, always-dynamic health endpoint.
// Used by Render's health check AND by the self-ping keep-alive
// (see instrumentation.ts) to stop the free instance from spinning down.
export const dynamic = "force-dynamic";

export const GET = () =>
    NextResponse.json({ status: "ok", time: new Date().toISOString() });
