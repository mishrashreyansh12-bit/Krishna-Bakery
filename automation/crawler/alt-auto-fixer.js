const fs = require("fs");

const FILE = "automation/test-site/Reviews.test.js";

console.log("?? ALT AUTO-FIXER");

if (!fs.existsSync(FILE)) {
  console.error(`? File not found: ${FILE}`);
  process.exit(1);
}

const original = fs.readFileSync(FILE, "utf8");

if (!original.includes('alt=""')) {
  console.log("? No missing ALT attributes found.");
  process.exit(0);
}

const backup = `${FILE}.backup`;

fs.copyFileSync(FILE, backup);

console.log(`?? Backup created: ${backup}`);

const fixed = original.replace(
  /(<img[^>]*?)\s+alt=""([^>]*>)/g,
  '$1 alt={`${reviewer.name} profile photo`}$2'
);

fs.writeFileSync(FILE, fixed, "utf8");

const validation = fs.readFileSync(FILE, "utf8");

if (validation.includes('alt=""')) {
  console.error("? VALIDATION FAILED.");
  console.log("?? Restoring backup...");

  fs.copyFileSync(backup, FILE);

  console.log("? Rollback completed.");
  process.exit(1);
}

console.log("?? ALT automatically added.");
console.log("? VALIDATION PASSED.");
console.log("? Fix kept.");

console.log("\n?? ALT AUTO-FIX COMPLETED");
