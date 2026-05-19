/**
 * Assemble le dossier deploy/ pour FTP (cPanel Node.js / standalone Next.js)
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const standaloneDir = path.join(root, ".next", "standalone");
const deployDir = path.join(root, "deploy");

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source introuvable : ${src}`);
  }
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
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

console.log("📦 Préparation du dossier deploy/…");
rmRecursive(deployDir);
fs.mkdirSync(deployDir, { recursive: true });

// Contenu standalone (server.js, node_modules minimaux, .next)
copyRecursive(standaloneDir, deployDir);

// Assets statiques requis par Next
const staticSrc = path.join(root, ".next", "static");
const staticDest = path.join(deployDir, ".next", "static");
if (fs.existsSync(staticSrc)) {
  copyRecursive(staticSrc, staticDest);
  console.log("  ✓ .next/static");
}

// Public (images locales, etc.)
const publicSrc = path.join(root, "public");
const publicDest = path.join(deployDir, "public");
if (fs.existsSync(publicSrc)) {
  copyRecursive(publicSrc, publicDest);
  console.log("  ✓ public/");
}

// Script de démarrage pour cPanel (Setup Node.js App → startup file)
const startSh = `#!/bin/bash
# Démarrage Next.js standalone (cPanel / Passenger)
cd "$(dirname "$0")"
export NODE_ENV=production
export PORT=\${PORT:-3000}
exec node server.js
`;
fs.writeFileSync(path.join(deployDir, "start.sh"), startSh, { mode: 0o755 });

// Fichier d'entrée alternatif pour certains hébergeurs cPanel
const appJs = `// Point d'entrée cPanel Node.js — redirige vers le serveur standalone
process.env.NODE_ENV = process.env.NODE_ENV || "production";
require("./server.js");
`;
fs.writeFileSync(path.join(deployDir, "app.js"), appJs);

console.log("✅ Dossier deploy/ prêt pour le FTP.");
