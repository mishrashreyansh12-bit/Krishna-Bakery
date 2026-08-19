const { Octokit } = require("@octokit/rest");

const octokit = new Octokit();

async function testGitHubAPI() {
  try {
    console.log("🔍 Connecting to GitHub API...");

    const { data } = await octokit.repos.get({
      owner: "mishrashreyansh12-bit",
      repo: "Krishna-Bakery",
    });

    console.log("\n✅ GitHub API Connected\n");

    console.log("Repository:", data.name);
    console.log("Owner:", data.owner.login);
    console.log("Default Branch:", data.default_branch);
    console.log("Public:", !data.private);
    console.log("Stars:", data.stargazers_count);
    console.log("Last Updated:", data.updated_at);
  } catch (error) {
    console.error("\n❌ GitHub API Error:");
    console.error(error.message);
  }
}

testGitHubAPI();