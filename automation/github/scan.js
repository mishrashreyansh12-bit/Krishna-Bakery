const { Octokit } = require("@octokit/rest");

const octokit = new Octokit();

const owner = "mishrashreyansh12-bit";
const repo = "Krishna-Bakery";

async function scanRepository() {
  try {
    console.log("🔍 Scanning GitHub repository...\n");

    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: "",
    });

    console.log("📁 Repository files:\n");

    data.forEach((item) => {
      console.log(
        item.type === "dir"
          ? `📂 ${item.name}`
          : `📄 ${item.name}`
      );
    });

    console.log("\n✅ Repository scan completed.");
  } catch (error) {
    console.error("\n❌ GitHub scan error:");
    console.error(error.message);
  }
}

scanRepository();