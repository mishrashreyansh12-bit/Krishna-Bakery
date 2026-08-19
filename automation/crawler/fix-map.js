const fs = require("fs");

const reportPath = "automation/crawler/seo-report.json";

if (!fs.existsSync(reportPath)) {
  console.error("❌ seo-report.json not found.");
  process.exit(1);
}

const report = JSON.parse(
  fs.readFileSync(reportPath, "utf8")
);

const fixes = report.seo.issues.map((issue) => {
  let file = "Unknown";
  let action = "Manual review required";

  if (issue.issue.includes("canonical")) {
    file = "public/index.html";
    action = "Add the canonical URL for the homepage.";
  }

  if (issue.issue.includes("Multiple H1")) {
    file = "src/components";
    action = "Find the multiple H1 elements and keep one primary H1.";
  }

  if (issue.issue.includes("missing ALT")) {
    file = "src/components";
    action = "Find images without alt attributes and add meaningful ALT text.";
  }

  return {
    issue: issue.issue,
    severity: issue.severity,
    file,
    action,
    codeChangeRequired: issue.codeChangeRequired,
  };
});

const output = {
  generatedAt: new Date().toISOString(),
  totalIssues: fixes.length,
  fixes,
};

fs.writeFileSync(
  "automation/crawler/fix-map.json",
  JSON.stringify(output, null, 2)
);

console.log("✅ Fix mapping completed.");
console.log("📄 Saved: automation/crawler/fix-map.json");

fixes.forEach((fix, index) => {
  console.log(
    `${index + 1}. [${fix.severity.toUpperCase()}] ${fix.issue}`
  );
  console.log(`   File: ${fix.file}`);
  console.log(`   Action: ${fix.action}`);
});