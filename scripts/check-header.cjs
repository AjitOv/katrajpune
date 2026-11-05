const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto("https://katrajpune.com", { waitUntil: "networkidle2", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 4000));

  const info = await page.evaluate(() => {
    const h = document.querySelector(".absolute.top-0");
    const inner = h?.querySelector("div");
    const pill = h?.querySelector("span");
    const cs = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { display: s.display, opacity: s.opacity, visibility: s.visibility, zIndex: s.zIndex, position: s.position, bg: s.backgroundColor, color: s.color, box: [r.x, r.y, r.width, r.height] };
    };
    return {
      header: cs(h),
      inner: cs(inner),
      pill: cs(pill),
      topEl: (() => { const e = document.elementFromPoint(60, 30); return e ? e.className + " | " + e.tagName : null; })(),
      atPointText: (() => { const e = document.elementFromPoint(60, 30); return e ? e.textContent.slice(0, 50) : null; })(),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await page.screenshot({ path: "/tmp/katraj-top.png" });
  await browser.close();
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
