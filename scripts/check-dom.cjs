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
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE " + m.text()); });

  await page.goto("https://katrajpune.com", { waitUntil: "networkidle2", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 6000));

  const diag = await page.evaluate(() => {
    const markers = [...document.querySelectorAll(".maplibregl-marker")];
    const header = document.querySelector(".absolute.top-0");
    return {
      url: location.href,
      markerCount: markers.length,
      firstMarkerHTML: markers[0]?.outerHTML.slice(0, 400) || null,
      headerExists: !!header,
      headerBox: header ? header.getBoundingClientRect().toJSON() : null,
      bodyText: document.body.innerText.slice(0, 300),
      stylesheets: [...document.styleSheets].map((s) => s.href || "inline").slice(0, 10),
      mapContainerStyle: (() => {
        const el = document.querySelector(".maplibregl-map");
        return el ? getComputedStyle(el).position + " " + el.getBoundingClientRect().toJSON().height : null;
      })(),
    };
  });
  console.log(JSON.stringify(diag, null, 2));
  console.log("ERRORS", errors.length ? errors.slice(0, 5) : "none");
  await browser.close();
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
