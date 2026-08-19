const { chromium } = require("playwright");

const URL = "http://localhost:3000";

async function crawlWebsite() {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    console.log("🌐 Opening website:", URL);

    const page = await browser.newPage();

    await page.goto(URL, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    console.log("✅ Website loaded");

    const seoData = await page.evaluate(() => {
      const getMeta = (name) =>
        document.querySelector(`meta[name="${name}"]`)?.content || "";

      const getCanonical = () =>
        document.querySelector('link[rel="canonical"]')?.href || "";

      const schemaElements = [
        ...document.querySelectorAll(
          'script[type="application/ld+json"]'
        ),
      ];

      const schemas = [];

      schemaElements.forEach((element) => {
        try {
          schemas.push(JSON.parse(element.textContent));
        } catch {
          // Ignore invalid JSON-LD
        }
      });

      return {
        url: window.location.href,

        title: document.title,

        description: getMeta("description"),

        canonical: getCanonical(),

        h1: document.querySelector("h1")?.innerText.trim() || "",

        h1Count: document.querySelectorAll("h1").length,

        images: document.querySelectorAll("img").length,

        imagesWithoutAlt: [
          ...document.querySelectorAll("img"),
        ].filter((img) => !img.getAttribute("alt")?.trim()).length,

        links: document.querySelectorAll("a").length,

        internalLinks: [
          ...document.querySelectorAll("a"),
        ].filter((a) => {
          try {
            return new URL(a.href).origin === window.location.origin;
          } catch {
            return false;
          }
        }).length,

        externalLinks: [
          ...document.querySelectorAll("a"),
        ].filter((a) => {
          try {
            return new URL(a.href).origin !== window.location.origin;
          } catch {
            return false;
          }
        }).length,

        schemaCount: schemas.length,

        schemas,
      };
    });

    console.log("\n✅ BROWSER SEO CRAWL COMPLETED\n");

    console.log(JSON.stringify(seoData, null, 2));
  } catch (error) {
    console.error("\n❌ Crawler error:");
    console.error(error.message);
  } finally {
    await browser.close();
  }
}

crawlWebsite();