# Déploiement — sonounameto.aymart.bj

Mode **Next.js standalone** : le build tourne sur GitHub Actions, le FTP n'envoie **pas** `node_modules`.

## Compte FTP

Le compte FTP ouvre **directement** le dossier du site. Le workflow utilise `REMOTE_DIR: /` (pas de sous-dossier créé).

## Workflow

1. Push sur `production` → build → dossier `deploy/`
2. FTP : `server.js`, `.next/`, `public/`, `package.json`, `package-lock.json` (sans `node_modules`)
3. **Sur cPanel** : Run NPM Install + Restart

## Secrets GitHub

| Secret | Description |
|--------|-------------|
| `CPANEL_SERVER` | Hôte FTP |
| `CPANEL_USER` | Utilisateur FTP |
| `CPANEL_PWD` | Mot de passe |
| `NEXT_PUBLIC_FIREBASE_*` | 6 variables (build) |

## cPanel — après chaque déploiement

1. **Setup Node.js App**
   - Racine : dossier du site (là où arrivent les fichiers FTP)
   - **Startup file** : `server.js` ou `app.js`
   - Node **18+**
2. **Run NPM Install** — installe les dépendances à partir de `package.json` (équivalent du `node_modules` standalone, mais sur le serveur)
3. **Restart** l'application

Voir aussi `CPANEL-INSTALL.txt` dans le dossier déployé.

## Pourquoi pas de node_modules en FTP ?

- Upload beaucoup plus rapide (des centaines de Mo en moins)
- Évite d'envoyer par erreur le `node_modules` de développement (caniuse-lite, etc.)
- Le `package.json` généré par Next standalone liste uniquement les paquets nécessaires en production

## Test local

```bash
npm run build:simple
cd deploy
npm install --omit=dev
node server.js
```

## Nettoyer un ancien déploiement

Si `node_modules` a été uploadé par erreur sur le serveur, supprime-le en FTP puis refais **Run NPM Install** sur cPanel.
