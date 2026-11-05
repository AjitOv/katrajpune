const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE " + m.text()); });

  await page.goto("https://katrajpune.com", { waitUntil: "networkidle2", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 5000));

  const step = async (label, fn) => {
    try {
      const v = await fn();
      console.log(label, JSON.stringify(v));
    } catch (e) {
      console.log(label, "FAILED", String(e).slice(0, 200));
    }
  };

  await step("initial", () =>
    page.evaluate(() => ({
      clusters: document.querySelectorAll(".maplibregl-marker").length,
      canvas: !!document.querySelector(".maplibregl-canvas"),
    }))
  );

  // Zoom in to street level using exposed controls
  await step("zoom", async () => {
    await page.evaluate(() => {
      const m = window.__katrajpuneMap;
      m.flyTo(73.8456, 18.4593, 17);
    });
    await new Promise((r) => setTimeout(r, 4000));
    return page.evaluate(() => document.querySelectorAll(".maplibregl-marker").length);
  });

  // Click the first individual marker
  await step("click", async () => {
    const clicked = await page.evaluate(() => {
      const el = document.querySelector(".maplibregl-marker div");
      if (!el) return false;
      el.click();
      return true;
    });
    await new Promise((r) => setTimeout(r, 1200));
    const card = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes("View Profile") || text.includes("Call") || text.includes("Directions");
    });
    return { clicked, card };
  });

  // Search
  await step("search", async () => {
    const input = await page.$("input");
    if (!input) return "no input";
    await input.type("katraj");
    await new Promise((r) => setTimeout(r, 1800));
    return page.evaluate(() => document.body.innerText.includes("Search results"));
  });

  console.log("ERRORS", errors.length ? errors.slice(0, 5) : "none");
  await page.screenshot({ path: "/tmp/katraj.png", fullPage: false });
  await browser.close();
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
