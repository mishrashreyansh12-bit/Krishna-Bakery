const OpenAI = require("openai");

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("❌ OPENAI_API_KEY not found");
  process.exit(1);
}

console.log("✅ OPENAI_API_KEY loaded");
console.log("🤖 Starting AI SEO analysis...");

const client = new OpenAI({
  apiKey: apiKey,
});

async function analyzeSEO() {
  try {
    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: `
Analyze this website SEO data:

Website: Krishna Bakery
URL: http://localhost:3000
Title: Krishna Bakery | Premium Artisanal Bakes
Description: Premium non-frosting cakes, English cakes, cheesecakes, and macarons.
H1: Missing
Schema: WebSite, Organization, BreadcrumbList

Give me:
1. SEO issues
2. Severity
3. Recommended fixes
4. Whether code changes are required

Return the result as JSON.
`,
    });

    console.log("\n✅ AI SEO ANALYSIS COMPLETED\n");
    console.log(response.output_text);
  } catch (error) {
    console.error("\n❌ AI analysis error:");
    console.error(error.message);
  }
}

analyzeSEO();