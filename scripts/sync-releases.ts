import "dotenv/config";
import { prisma } from "@/lib/prisma";

const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_REPO) {
  throw new Error("GITHUB_REPO is missing in .env");
}

type GitHubAsset = {
  name: string;
  browser_download_url: string;
  size: number;
  content_type: string;
};

type GitHubRelease = {
  tag_name: string;
  name: string | null;
  published_at: string;
  draft: boolean;
  prerelease: boolean;
  assets: GitHubAsset[];
};

function isWindowsAsset(name: string): boolean {
  const n = name.toLowerCase();

  return (
    n.includes("windows") ||
    n.includes("-win") ||
    n.includes("win-") ||
    n.endsWith(".exe") ||
    n.endsWith(".msi")
  );
}

function isMacAsset(name: string): boolean {
  const n = name.toLowerCase();

  return (
    n.includes("macos") ||
    n.includes("mac") ||
    n.includes("darwin") ||
    n.endsWith(".dmg") ||
    n.endsWith(".pkg")
  );
}

function pickAsset(
  assets: GitHubAsset[],
  isPlatform: (name: string) => boolean,
  preferredExtensions: string[],
): GitHubAsset | null {
  const candidates = assets.filter((asset) => isPlatform(asset.name));

  if (candidates.length === 0) {
    return null;
  }

  for (const extension of preferredExtensions) {
    const preferred = candidates.find((asset) =>
      asset.name.toLowerCase().endsWith(extension),
    );

    if (preferred) {
      return preferred;
    }
  }

  return candidates[0];
}

async function main() {
  console.log(`Fetching latest release from GitHub repo: ${GITHUB_REPO}`);

  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "lapwork-website",
        ...(GITHUB_TOKEN
          ? {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
            }
          : {}),
      },
    },
  );

  if (response.status === 404) {
    console.log("No latest release found on GitHub. Create a release first.");
    return;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API failed: ${response.status} ${errorText}`);
  }

  const release = (await response.json()) as GitHubRelease;

  console.log(`Latest release: ${release.tag_name}`);
  console.log(`Published at: ${release.published_at}`);

  const windowsAsset = pickAsset(release.assets, isWindowsAsset, [
    ".exe",
    ".msi",
  ]);

  const macAsset = pickAsset(release.assets, isMacAsset, [".dmg", ".pkg"]);

  const releasesToSave: Array<{
    platform: string;
    fileName: string;
    downloadUrl: string;
    size: number;
  }> = [];

  if (windowsAsset) {
    releasesToSave.push({
      platform: "windows",
      fileName: windowsAsset.name,
      downloadUrl: windowsAsset.browser_download_url,
      size: windowsAsset.size,
    });
  }

  if (macAsset) {
    releasesToSave.push({
      platform: "macos",
      fileName: macAsset.name,
      downloadUrl: macAsset.browser_download_url,
      size: macAsset.size,
    });
  }

  if (releasesToSave.length === 0) {
    console.log("No downloadable Windows/macOS assets found in this release.");
    return;
  }

  for (const releaseItem of releasesToSave) {
    await prisma.appRelease.upsert({
      where: {
        version_platform: {
          version: release.tag_name,
          platform: releaseItem.platform,
        },
      },
      create: {
        version: release.tag_name,
        platform: releaseItem.platform,
        fileName: releaseItem.fileName,
        downloadUrl: releaseItem.downloadUrl,
        size: releaseItem.size,
        publishedAt: new Date(release.published_at),
      },
      update: {
        fileName: releaseItem.fileName,
        downloadUrl: releaseItem.downloadUrl,
        size: releaseItem.size,
        publishedAt: new Date(release.published_at),
      },
    });

    console.log(
      `Saved ${releaseItem.platform} release: ${release.tag_name} (${releaseItem.fileName})`,
    );
  }

  console.log("Release sync completed.");
}

main()
  .catch((error) => {
    console.error("Release sync failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });