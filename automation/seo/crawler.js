const { chromium } = require("playwright");
const fs = require("fs");

const BASE_URL = "http://localhost:3000";

const OUTPUT_PATH =
  "automation/crawler/multi-page-seo-report.json";

function normalizeUrl(url) {
  const parsed = new URL(url);

  // Remove #collection, #reviews etc.
  parsed.hash = "";

  // Remove trailing slash except homepage
  if (
    parsed.pathname !== "/" &&
    parsed.pathname.endsWith("/")
  ) {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }

  return parsed.origin + parsed.pathname;
}

async function crawlWebsite() {
  const browser = await chromium.launch({
    headless: true,
  });

  const visited = new Set();
  const pages = [];

  try {
    console.log(
      "🌐 Starting multi-page SEO crawler..."
    );

    console.log(
      `📍 Base URL: ${BASE_URL}\n`
    );

    const page = await browser.newPage();

    async function crawl(url) {
      const normalizedUrl = normalizeUrl(url);

      // Prevent duplicate pages
      if (visited.has(normalizedUrl)) {
        return;
      }

      visited.add(normalizedUrl);

      try {
        console.log(
          `🔍 Crawling: ${normalizedUrl}`
        );

        await page.goto(normalizedUrl, {
          waitUntil: "networkidle",
          timeout: 30000,
        });

        const seoData = await page.evaluate(() => {
          const getMeta = (name) =>
            document
              .querySelector(
                `meta[name="${name}"]`
              )
              ?.getAttribute("content")
              ?.trim() || "";

          const canonical =
            document
              .querySelector(
                'link[rel="canonical"]'
              )
              ?.getAttribute("href") || "";

          const schemaElements = [
            ...document.querySelectorAll(
              'script[type="application/ld+json"]'
            ),
          ];

          const schemas = [];

          schemaElements.forEach((element) => {
            try {
              schemas.push(
                JSON.parse(
                  element.textContent
                )
              );
            } catch {
              schemas.push({
                invalidJsonLd: true,
              });
            }
          });

          const images = [
            ...document.querySelectorAll("img"),
          ];

          const links = [
            ...document.querySelectorAll(
              "a[href]"
            ),
          ];

          const internalLinks = [];

          const externalLinks = [];

          links.forEach((link) => {
            try {
              const linkUrl = new URL(
                link.href,
                window.location.href
              );

              if (
                linkUrl.origin ===
                window.location.origin
              ) {
                linkUrl.hash = "";

                if (
                  linkUrl.pathname !== "/" &&
                  linkUrl.pathname.endsWith("/")
                ) {
                  linkUrl.pathname =
                    linkUrl.pathname.slice(
                      0,
                      -1
                    );
                }

                internalLinks.push(
                  linkUrl.origin +
                    linkUrl.pathname
                );
              } else {
                externalLinks.push(
                  linkUrl.href
                );
              }
            } catch {
              // Ignore invalid links
            }
          });

          const imagesWithoutAlt =
            images
              .filter(
                (img) =>
                  !img
                    .getAttribute("alt")
                    ?.trim()
              )
              .map((img) => ({
                src:
                  img.getAttribute("src") ||
                  "",
                html:
                  img.outerHTML.substring(
                    0,
                    300
                  ),
              }));

          return {
            url: window.location.href,

            title:
              document.title.trim(),

            description:
              getMeta("description"),

            canonical,

            h1Count:
              document.querySelectorAll(
                "h1"
              ).length,

            h1Texts: [
              ...document.querySelectorAll(
                "h1"
              ),
            ].map((h1) =>
              h1.innerText.trim()
            ),

            imageCount:
              images.length,

            imagesWithoutAlt:
              imagesWithoutAlt.length,

            imagesWithoutAltDetails:
              imagesWithoutAlt,

            schemaCount:
              schemas.length,

            schemas,

            internalLinks: [
              ...new Set(
                internalLinks
              ),
            ],

            externalLinks: [
              ...new Set(
                externalLinks
              ),
            ],
          };
        });

        pages.push(seoData);

        // Crawl discovered internal pages
        for (const link of seoData.internalLinks) {
          if (!visited.has(link)) {
            await crawl(link);
          }
        }
      } catch (error) {
        console.log(
          `❌ Failed: ${normalizedUrl}`
        );

        console.log(
          `   ${error.message}`
        );
      }
    }

    await crawl(BASE_URL);

    const report = {
      generatedAt:
        new Date().toISOString(),

      website: BASE_URL,

      totalPages:
        pages.length,

      pages,

      summary: {
        totalImages:
          pages.reduce(
            (sum, page) =>
              sum + page.imageCount,
            0
          ),

        totalImagesWithoutAlt:
          pages.reduce(
            (sum, page) =>
              sum +
              page.imagesWithoutAlt,
            0
          ),

        totalSchemas:
          pages.reduce(
            (sum, page) =>
              sum + page.schemaCount,
            0
          ),

        pagesWithMissingTitle:
          pages.filter(
            (page) => !page.title
          ).length,

        pagesWithMissingDescription:
          pages.filter(
            (page) =>
              !page.description
          ).length,

        pagesWithMissingCanonical:
          pages.filter(
            (page) =>
              !page.canonical
          ).length,

        pagesWithMissingH1:
          pages.filter(
            (page) =>
              page.h1Count === 0
          ).length,

        pagesWithMultipleH1:
          pages.filter(
            (page) =>
              page.h1Count > 1
          ).length,
      },
    };

    fs.writeFileSync(
      OUTPUT_PATH,
      JSON.stringify(
        report,
        null,
        2
      )
    );

    console.log(
      "\n✅ MULTI-PAGE CRAWL COMPLETED\n"
    );

    console.log(
      `📄 Pages crawled: ${report.totalPages}`
    );

    console.log(
      `🖼️ Total images: ${report.summary.totalImages}`
    );

    console.log(
      `⚠️ Images without ALT: ${report.summary.totalImagesWithoutAlt}`
    );

    console.log(
      `📊 Total schemas: ${report.summary.totalSchemas}`
    );

    console.log(
      `📄 Report saved: ${OUTPUT_PATH}`
    );
  } catch (error) {
    console.error(
      "\n❌ Crawler error:"
    );

    console.error(
      error.message
    );
  } finally {
    await browser.close();
  }
}

crawlWebsite();