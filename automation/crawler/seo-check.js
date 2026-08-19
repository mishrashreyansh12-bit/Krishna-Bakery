const { chromium } = require("playwright");
const fs = require("fs");

const URL = "http://localhost:3000";

async function runSEOCheck() {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    console.log("🔍 Starting automatic SEO audit...");

    const page = await browser.newPage();

    await page.goto(URL, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    const seoReport = await page.evaluate(() => {
      const title = document.title.trim();

      const description =
        document.querySelector('meta[name="description"]')
          ?.getAttribute("content")
          ?.trim() || "";

      const canonical =
        document.querySelector('link[rel="canonical"]')
          ?.getAttribute("href") || "";

      const h1Elements = [
        ...document.querySelectorAll("h1"),
      ];

      const images = [
        ...document.querySelectorAll("img"),
      ];

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
          // Ignore invalid schema
        }
      });

      const issues = [];

      // Title check
      if (!title) {
        issues.push({
          issue: "Missing title tag",
          severity: "high",
          recommendation: "Add a unique and descriptive title tag.",
          codeChangeRequired: true,
        });
      } else if (title.length < 30 || title.length > 60) {
        issues.push({
          issue: `Title length is ${title.length} characters`,
          severity: "medium",
          recommendation:
            "Keep the title approximately between 30 and 60 characters.",
          codeChangeRequired: true,
        });
      }

      // Meta description
      if (!description) {
        issues.push({
          issue: "Missing meta description",
          severity: "high",
          recommendation:
            "Add a unique meta description for the homepage.",
          codeChangeRequired: true,
        });
      } else if (
        description.length < 70 ||
        description.length > 160
      ) {
        issues.push({
          issue: `Meta description length is ${description.length} characters`,
          severity: "medium",
          recommendation:
            "Keep the meta description approximately between 70 and 160 characters.",
          codeChangeRequired: true,
        });
      }

      // Canonical
      if (!canonical) {
        issues.push({
          issue: "Missing canonical URL",
          severity: "high",
          recommendation:
            "Add a canonical link element pointing to the preferred homepage URL.",
          codeChangeRequired: true,
        });
      }

      // H1
      if (h1Elements.length === 0) {
        issues.push({
          issue: "Missing H1 heading",
          severity: "high",
          recommendation:
            "Add one clear primary H1 heading to the page.",
          codeChangeRequired: true,
        });
      } else if (h1Elements.length > 1) {
        issues.push({
          issue: `Multiple H1 headings detected (${h1Elements.length})`,
          severity: "medium",
          recommendation:
            "Review the page and keep one primary H1 where appropriate.",
          codeChangeRequired: true,
        });
      }

      // Images / ALT
    //   const imagesWithoutAlt = images.filter(
    //     (img) => !img.getAttribute("alt")?.trim()
    //   );

    //   if (imagesWithoutAlt.length > 0) {
    //     issues.push({
    //       issue: `${imagesWithoutAlt.length} images are missing ALT text`,
    //       severity: "medium",
    //       recommendation:
    //         "Add meaningful ALT text to informative images.",
    //       codeChangeRequired: true,
    //     });
    //   }
    const imagesWithoutAlt = images.filter(
  (img) => !img.getAttribute("alt")?.trim()
);

console.log("\nImages without ALT:");

imagesWithoutAlt.forEach((img, index) => {
  console.log(`Image ${index + 1}:`);
  console.log("SRC:", img.getAttribute("src"));
  console.log("HTML:", img.outerHTML.substring(0, 300));
});

      // Schema
      if (schemas.length === 0) {
        issues.push({
          issue: "No structured data detected",
          severity: "medium",
          recommendation:
            "Add relevant Schema.org structured data.",
          codeChangeRequired: true,
        });
      }

      return {
        url: window.location.href,
        title,
        titleLength: title.length,
        description,
        descriptionLength: description.length,
        canonical,
        h1Count: h1Elements.length,
        h1Texts: h1Elements.map((h1) =>
          h1.innerText.trim()
        ),
        imageCount: images.length,
        imagesWithoutAlt: imagesWithoutAlt.length,
        schemaCount: schemas.length,
        issues,
      };
    });

    const output = {
      generatedAt: new Date().toISOString(),
      website: URL,
      summary: {
        totalIssues: seoReport.issues.length,
        high: seoReport.issues.filter(
          (issue) => issue.severity === "high"
        ).length,
        medium: seoReport.issues.filter(
          (issue) => issue.severity === "medium"
        ).length,
        low: seoReport.issues.filter(
          (issue) => issue.severity === "low"
        ).length,
      },
      seo: seoReport,
    };

    fs.writeFileSync(
      "automation/crawler/seo-report.json",
      JSON.stringify(output, null, 2)
    );

    console.log("\n✅ SEO AUDIT COMPLETED\n");

    console.log(
      `Total Issues: ${output.summary.totalIssues}`
    );

    console.log(
      `High: ${output.summary.high}`
    );

    console.log(
      `Medium: ${output.summary.medium}`
    );

    console.log(
      `Low: ${output.summary.low}`
    );

    console.log(
      "\n📄 Report saved: automation/crawler/seo-report.json"
    );

    console.log("\nIssues:");

    output.seo.issues.forEach((issue, index) => {
      console.log(
        `${index + 1}. [${issue.severity.toUpperCase()}] ${issue.issue}`
      );
    });
  } catch (error) {
    console.error("\n❌ SEO audit error:");
    console.error(error.message);
  } finally {
    await browser.close();
  }
}

runSEOCheck();