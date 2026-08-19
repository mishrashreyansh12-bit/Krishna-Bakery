const cheerio = require("cheerio");

async function crawlPage(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const title = $("title").text().trim();
  const description = $('meta[name="description"]').attr("content") || "";
  const canonical = $('link[rel="canonical"]').attr("href") || "";
  const h1 = $("h1").first().text().trim();

  const schema = [];

  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      schema.push(JSON.parse($(element).text()));
    } catch {
      schema.push({ invalidJsonLd: true });
    }
  });

  return {
    url,
    title,
    description,
    canonical,
    h1,
    schemaCount: schema.length,
    schema,
  };
}

crawlPage("http://localhost:3000")
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((error) => {
    console.error("Crawler error:", error.message);
  });