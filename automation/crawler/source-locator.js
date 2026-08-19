const fs = require("fs");
const path = require("path");

const reportPath = path.join(
  process.cwd(),
  "automation",
  "crawler",
  "seo-report.json"
);

if (!fs.existsSync(reportPath)) {
  console.error("❌ seo-report.json not found.");
  console.error("Run seo-check.js first.");
  process.exit(1);
}

const report = JSON.parse(
  fs.readFileSync(reportPath, "utf8")
);

const projectRoot = process.cwd();

const sourceExtensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
];

const ignoredDirectories = [
  "node_modules",
  "build",
  ".git",
  "automation",
];

function getSourceFiles(directory) {
  const results = [];

  if (!fs.existsSync(directory)) {
    return results;
  }

  for (const entry of fs.readdirSync(directory, {
    withFileTypes: true,
  })) {
    const fullPath = path.join(directory, entry.name);

    if (
      entry.isDirectory() &&
      !ignoredDirectories.includes(entry.name)
    ) {
      results.push(...getSourceFiles(fullPath));
    }

    if (
      entry.isFile() &&
      sourceExtensions.includes(path.extname(entry.name))
    ) {
      results.push(fullPath);
    }
  }

  return results;
}

const sourceFiles = getSourceFiles(projectRoot);

console.log(`🔍 Scanning ${sourceFiles.length} source files...\n`);

const findings = [];

for (const file of sourceFiles) {
  let content;

  try {
    content = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }

  /*
   * Remove JavaScript comments before scanning.
   *
   * This prevents commented code like:
   *
   * // <h1>Old headline</h1>
   *
   * from being detected as a real H1.
   */

  const cleanContent = content
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");

  const lines = cleanContent.split(/\r?\n/);

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Find actual H1 elements
    if (/<h1[\s>]/i.test(trimmed)) {
      findings.push({
        type: "H1",
        file: path.relative(projectRoot, file),
        line: index + 1,
        code: trimmed,
      });
    }

    // Find actual images
    if (/<img[\s>]/i.test(trimmed)) {
      const hasAlt =
        /\balt\s*=\s*["'][^"']*["']/i.test(trimmed) ||
        /\balt\s*=\s*\{[^}]+\}/i.test(trimmed);

      if (!hasAlt) {
        findings.push({
          type: "IMAGE_WITHOUT_ALT",
          file: path.relative(projectRoot, file),
          line: index + 1,
          code: trimmed,
        });
      }
    }
  });
}

const h1Findings = findings.filter(
  (item) => item.type === "H1"
);

const imageFindings = findings.filter(
  (item) => item.type === "IMAGE_WITHOUT_ALT"
);

const sourceReport = {
  generatedAt: new Date().toISOString(),

  issues: report.seo.issues,

  h1: {
    count: h1Findings.length,
    locations: h1Findings,
  },

  imagesWithoutAlt: {
    count: imageFindings.length,
    locations: imageFindings,
  },
};

const outputPath = path.join(
  process.cwd(),
  "automation",
  "crawler",
  "source-locations.json"
);

fs.writeFileSync(
  outputPath,
  JSON.stringify(sourceReport, null, 2)
);

console.log("✅ Source scan completed.\n");

console.log(
  `H1 elements found: ${h1Findings.length}`
);

h1Findings.forEach((item) => {
  console.log(
    `  → ${item.file}:${item.line}`
  );
});

console.log(
  `\nImages without ALT found: ${imageFindings.length}`
);

imageFindings.forEach((item) => {
  console.log(
    `  → ${item.file}:${item.line}`
  );
});

console.log(
  `\n📄 Saved: automation/crawler/source-locations.json`
);