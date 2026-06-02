// Next.js runs register() once when the server process boots (both `next dev`
// and `next start`). We use it to keep a free Render instance awake: every
// 10 minutes the app makes an HTTP request to its own /api/health endpoint.
// That inbound request resets Render's idle timer, so the service does not
// spin down (Render's free tier sleeps after ~15 min with no traffic).
//
// Controlled by env vars:
//   DISABLE_SELF_PING=true  -> turn the self-ping off (set this locally)
//   SELF_PING_URL=...       -> URL to ping (falls back to NEXTAUTH_URL,
//                              then Render's auto-provided RENDER_EXTERNAL_URL)
export async function register() {
    // Only run on the Node.js server runtime (not the Edge runtime).
    if (process.env.NEXT_RUNTIME !== "nodejs") return;

    if (process.env.DISABLE_SELF_PING === "true") {
        console.log("[self-ping] disabled via DISABLE_SELF_PING");
        return;
    }

    const base =
        process.env.SELF_PING_URL ||
        process.env.NEXTAUTH_URL ||
        process.env.RENDER_EXTERNAL_URL;

    if (!base) {
        console.log("[self-ping] no base URL configured; skipping");
        return;
    }

    const target = `${base.replace(/\/+$/, "")}/api/health`;
    const TEN_MINUTES = 10 * 60 * 1000;

    const ping = async () => {
        try {
            const res = await fetch(target, { cache: "no-store" });
            console.log(`[self-ping] ${target} -> ${res.status}`);
        } catch (err) {
            console.error("[self-ping] failed:", err);
        }
    };

    setInterval(ping, TEN_MINUTES);
    console.log(`[self-ping] enabled, every 10 min -> ${target}`);
}
