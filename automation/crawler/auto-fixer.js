const fs = require("fs");

const fixMapPath = "automation/test-site/test-fix-map.json";

const canonicalUrl =
  "https://stirring-madeleine-7eec5d.netlify.app";

const metaDescription =
  "Premium non-frosting cakes, English cakes, cheesecakes, and macarons at Krishna Bakery. Customize your desserts with AI and chat with our expert bakers.";

const h1Text = "Krishna Bakery";

console.log("\n🤖 SAFE SEO AUTO-FIXER\n");

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

// Check fix map
if (!fs.existsSync(fixMapPath)) {
  fail("test-fix-map.json not found.");
}

const fixMap = JSON.parse(
  fs.readFileSync(fixMapPath, "utf8")
);

if (!fixMap.fixes || fixMap.fixes.length === 0) {
  console.log("✅ No SEO issues found.");
  console.log("🏁 AUTO-FIX PROCESS COMPLETED\n");
  process.exit(0);
}

// Process every fix
for (const fix of fixMap.fixes) {
  const filePath = fix.file;
  const backupPath = `${filePath}.backup`;

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    continue;
  }

  const original = fs.readFileSync(
    filePath,
    "utf8"
  );

  // Remove commented HTML while checking
  const withoutComments = original.replace(
    /<!--[\s\S]*?-->/g,
    ""
  );

  // ==================================================
  // 1. CANONICAL
  // ==================================================

  if (fix.issue === "Missing canonical URL") {
    const canonicalRegex =
      /<link\b[^>]*rel=["']canonical["'][^>]*>/i;

    if (canonicalRegex.test(withoutComments)) {
      console.log("✅ Canonical already exists.");
      continue;
    }

    fs.writeFileSync(
      backupPath,
      original,
      "utf8"
    );

    console.log(
      `💾 Backup created: ${backupPath}`
    );

    if (!original.includes("</head>")) {
      console.log("❌ </head> not found.");
      fs.copyFileSync(
        backupPath,
        filePath
      );
      continue;
    }

    const canonicalTag =
      `  <link rel="canonical" href="${canonicalUrl}" />`;

    const updated = original.replace(
      "</head>",
      `${canonicalTag}\n</head>`
    );

    fs.writeFileSync(
      filePath,
      updated,
      "utf8"
    );

    console.log("🔧 Canonical added.");

    const afterFix = fs.readFileSync(
      filePath,
      "utf8"
    );

    const afterFixWithoutComments =
      afterFix.replace(
        /<!--[\s\S]*?-->/g,
        ""
      );

    const valid =
      canonicalRegex.test(
        afterFixWithoutComments
      );

    if (valid) {
      console.log("✅ VALIDATION PASSED.");
      console.log("✅ Fix kept.");
    } else {
      console.log("❌ VALIDATION FAILED.");
      console.log("🔄 Restoring backup...");

      fs.copyFileSync(
        backupPath,
        filePath
      );

      console.log("✅ Rollback completed.");
    }
  }

  // ==================================================
  // 2. META DESCRIPTION
  // ==================================================

  if (fix.issue === "Missing meta description") {
    const metaRegex =
      /<meta\b[^>]*name=["']description["'][^>]*>/i;

    if (metaRegex.test(withoutComments)) {
      console.log(
        "✅ Meta description already exists."
      );
      continue;
    }

    fs.writeFileSync(
      backupPath,
      original,
      "utf8"
    );

    console.log(
      `💾 Backup created: ${backupPath}`
    );

    if (!original.includes("</head>")) {
      console.log("❌ </head> not found.");

      fs.copyFileSync(
        backupPath,
        filePath
      );

      continue;
    }

    const metaTag =
      `  <meta name="description" content="${metaDescription}" />`;

    const updated = original.replace(
      "</head>",
      `${metaTag}\n</head>`
    );

    fs.writeFileSync(
      filePath,
      updated,
      "utf8"
    );

    console.log(
      "🔧 Meta description added."
    );

    const afterFix = fs.readFileSync(
      filePath,
      "utf8"
    );

    const afterFixWithoutComments =
      afterFix.replace(
        /<!--[\s\S]*?-->/g,
        ""
      );

    const valid =
      metaRegex.test(
        afterFixWithoutComments
      );

    if (valid) {
      console.log("✅ VALIDATION PASSED.");
      console.log("✅ Fix kept.");
    } else {
      console.log("❌ VALIDATION FAILED.");
      console.log("🔄 Restoring backup...");

      fs.copyFileSync(
        backupPath,
        filePath
      );

      console.log(
        "✅ Rollback completed."
      );
    }
  }

  // ==================================================
  // 3. H1
  // ==================================================

  if (fix.issue === "Missing H1 heading") {
    const h1Regex =
      /<h1\b[^>]*>[\s\S]*?<\/h1>/i;

    if (h1Regex.test(withoutComments)) {
      console.log("✅ H1 already exists.");
      continue;
    }

    fs.writeFileSync(
      backupPath,
      original,
      "utf8"
    );

    console.log(
      `💾 Backup created: ${backupPath}`
    );

    if (!/<body\b[^>]*>/i.test(original)) {
      console.log("❌ <body> not found.");

      fs.copyFileSync(
        backupPath,
        filePath
      );

      continue;
    }

    const h1Tag =
      `    <h1>${h1Text}</h1>`;

    const updated = original.replace(
      /(<body\b[^>]*>)/i,
      `$1\n${h1Tag}`
    );

    fs.writeFileSync(
      filePath,
      updated,
      "utf8"
    );

    console.log("🔧 H1 added.");

    // Validation
    const afterFix = fs.readFileSync(
      filePath,
      "utf8"
    );

    const afterFixWithoutComments =
      afterFix.replace(
        /<!--[\s\S]*?-->/g,
        ""
      );

    const valid =
      h1Regex.test(
        afterFixWithoutComments
      );

    if (valid) {
      console.log("✅ VALIDATION PASSED.");
      console.log("✅ Fix kept.");
    } else {
      console.log("❌ VALIDATION FAILED.");
      console.log("🔄 Restoring backup...");

      fs.copyFileSync(
        backupPath,
        filePath
      );

      console.log(
        "✅ Rollback completed."
      );
    }
  }
}

console.log(
  "\n🏁 AUTO-FIX PROCESS COMPLETED\n"
);