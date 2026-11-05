const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on("console", async (m) => {
    const parts = [];
    for (const a of m.args()) {
      try {
        const v = await a.evaluate((x) => {
          if (x instanceof Error) return { name: x.name, message: x.message, stack: x.stack };
          try { return JSON.stringify(x); } catch { return String(x); }
        });
        parts.push(typeof v === "string" ? v : JSON.stringify(v));
      } catch { parts.push(a.toString()); }
    }
    console.log("CONSOLE", m.type(), parts.join(" | ").slice(0, 1500));
  });
  page.on("pageerror", (e) => console.log("PAGEERROR", String(e).slice(0, 800)));
  page.on("requestfailed", (r) => console.log("REQFAIL", r.url().slice(0, 120), r.failure()?.errorText));

  const res = await page.goto("https://katrajpune.com", { waitUntil: "networkidle2", timeout: 45000 });
  console.log("STATUS", res.status());
  await new Promise((r) => setTimeout(r, 6000));

  const info = await page.evaluate(() => ({
    markers: document.querySelectorAll(".maplibregl-marker").length,
    canvases: document.querySelectorAll(".maplibregl-canvas").length,
    errorText: document.body.innerText.slice(0, 200),
  }));
  console.log("INFO", JSON.stringify(info));
  await browser.close();
})().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
