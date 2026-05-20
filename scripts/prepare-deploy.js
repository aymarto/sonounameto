/**
 * Assemble deploy/ pour FTP cPanel — Next.js standalone SANS node_modules.
 * Les dépendances sont installées sur le serveur via "Run NPM Install" (cPanel).
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const standaloneDir = path.join(root, ".next", "standalone");
const deployDir = path.join(root, "deploy");

/** Dossiers exclus à toute profondeur lors de la copie */
const EXCLUDE_DIRS = new Set(["node_modules"]);

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source introuvable : ${src}`);
  }
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (EXCLUDE_DIRS.has(path.basename(src))) {
      return;
    }
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function rmRecursive(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

if (!fs.existsSync(standaloneDir)) {
  console.error(
    "❌ .next/standalone introuvable. Lancez d'abord : npm run build"
  );
  process.exit(1);
}

console.log("📦 Préparation du dossier deploy/ (standalone, sans node_modules)…");
rmRecursive(deployDir);
fs.mkdirSync(deployDir, { recursive: true });

// Serveur Next + package.json (sans node_modules)
copyRecursive(standaloneDir, deployDir);
console.log("  ✓ standalone (hors node_modules)");

// Assets statiques requis
const staticSrc = path.join(root, ".next", "static");
const staticDest = path.join(deployDir, ".next", "static");
if (fs.existsSync(staticSrc)) {
  copyRecursive(staticSrc, staticDest);
  console.log("  ✓ .next/static");
}

const publicSrc = path.join(root, "public");
const publicDest = path.join(deployDir, "public");
if (fs.existsSync(publicSrc)) {
  copyRecursive(publicSrc, publicDest);
  console.log("  ✓ public/");
}

// version.json (cache bust côté client)
const versionSrc = path.join(root, "public", "version.json");
if (fs.existsSync(versionSrc)) {
  fs.mkdirSync(path.join(deployDir, "public"), { recursive: true });
  fs.copyFileSync(versionSrc, path.join(deployDir, "public", "version.json"));
  console.log("  ✓ public/version.json");
}

// package-lock.json pour un npm install reproductible sur cPanel
const pkgPath = path.join(deployDir, "package.json");
if (fs.existsSync(pkgPath)) {
  try {
    execSync("npm install --package-lock-only --omit=dev", {
      cwd: deployDir,
      stdio: "pipe",
    });
    console.log("  ✓ package-lock.json");
  } catch {
    console.warn("  ⚠ package-lock.json non généré (npm install sur le serveur suffit)");
  }
}

// Instructions post-déploiement
const readme = `# Déploiement SONOUNAMETO — étapes cPanel

1. Les fichiers ont été envoyés par FTP (sans node_modules).
2. cPanel → Setup Node.js App
   - Application root : ce dossier
   - Startup file : server.js (ou app.js)
   - Node.js 18+
3. Cliquer sur **Run NPM Install** (installe les dépendances listées dans package.json)
4. **Restart** l'application

Variables d'environnement (si besoin côté serveur) :
- NODE_ENV=production
- PORT (souvent défini automatiquement par cPanel)
`;
fs.writeFileSync(path.join(deployDir, "CPANEL-INSTALL.txt"), readme);

const fix403 = fs.readFileSync(
  path.join(root, "CPANEL-403-FIX.md"),
  "utf8"
);
fs.writeFileSync(path.join(deployDir, "CPANEL-403-FIX.md"), fix403);
console.log("  ✓ CPANEL-403-FIX.md");

const startSh = `#!/bin/bash
cd "$(dirname "$0")"
export NODE_ENV=production
export PORT=\${PORT:-3000}
exec node server.js
`;
fs.writeFileSync(path.join(deployDir, "start.sh"), startSh, { mode: 0o755 });

const appJs = `process.env.NODE_ENV = process.env.NODE_ENV || "production";
require("./server.js");
`;
fs.writeFileSync(path.join(deployDir, "app.js"), appJs);

// Vérification obligatoire
if (fs.existsSync(path.join(deployDir, "node_modules"))) {
  console.error("❌ node_modules présent dans deploy/ — copie annulée.");
  process.exit(1);
}

if (!fs.existsSync(path.join(deployDir, "server.js"))) {
  console.error("❌ server.js manquant dans deploy/");
  process.exit(1);
}

if (!fs.existsSync(pkgPath)) {
  console.error("❌ package.json manquant dans deploy/");
  process.exit(1);
}

console.log("✅ deploy/ prêt pour FTP (sans node_modules).");
console.log("   → Sur cPanel : Run NPM Install puis Restart.");
