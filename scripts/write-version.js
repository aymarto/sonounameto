/**
 * Génère public/version.json avant le build (identifiant unique par déploiement).
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");

let gitSha = "local";
try {
  gitSha = execSync("git rev-parse --short HEAD", {
    cwd: root,
    stdio: ["ignore", "pipe", "ignore"],
  })
    .toString()
    .trim();
} catch {
  /* hors git */
}

const version = `${Date.now()}-${gitSha}`;
const payload = {
  version,
  builtAt: new Date().toISOString(),
};

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(
  path.join(publicDir, "version.json"),
  JSON.stringify(payload, null, 2)
);

// Lu automatiquement par `next build`
fs.writeFileSync(
  path.join(root, ".env.production.local"),
  `NEXT_PUBLIC_BUILD_ID=${version}\n`,
  "utf8"
);

console.log(`✓ version.json → ${version}`);
