# Déploiement — sonounameto.aymart.bj

Déploiement automatique via **GitHub Actions** + **FTP** vers cPanel (même principe que `me.aymart.bj`).

## 1. Branche `production`

Le workflow se déclenche sur un push vers la branche **`production`** (ou manuellement : *Actions → Deploy SONOUNAMETO → Run workflow*).

```bash
git checkout -b production
git push -u origin production
```

## 2. Secrets GitHub

Dans le dépôt : **Settings → Secrets and variables → Actions → New repository secret**

### FTP cPanel (compte dédié `sonounameto`)

| Secret | Exemple | Description |
|--------|---------|-------------|
| `CPANEL_SERVER` | `ftp.aymart.bj` ou IP | Hôte FTP |
| `CPANEL_USER` | utilisateur FTP sonounameto | Login FTP |
| `CPANEL_PWD` | •••••• | Mot de passe FTP |

Le dossier distant cible est **`/sonounameto.aymart.bj`** (défini dans le workflow). Si ton FTP ouvre déjà directement ce répertoire à la connexion, adapte `REMOTE_DIR` dans `.github/workflows/deploy-production.yml` (par ex. `/`).

### Firebase (obligatoire au build)

Les variables `NEXT_PUBLIC_*` doivent être dans les secrets pour être incluses dans le build :

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

(Copier les mêmes valeurs que dans `.env.local`.)

## 3. cPanel — application Node.js

Après le premier déploiement FTP :

1. **cPanel → Setup Node.js App** (ou *Application Manager*)
2. Créer une app :
   - **Node.js version** : 18.x (ou 20.x si dispo)
   - **Application root** : le dossier du site (`sonounameto.aymart.bj`)
   - **Application URL** : domaine `sonounameto.aymart.bj`
   - **Application startup file** : `server.js` ou `app.js`
3. Variables d’environnement (optionnel côté serveur si déjà dans le build) :
   - `NODE_ENV=production`
   - `PORT` (souvent fourni par cPanel)
4. **Run NPM Install** n’est en général **pas** nécessaire : le build standalone embarque les dépendances minimales.
5. Démarrer / redémarrer l’application après chaque déploiement.

### Fichiers déployés

Le dossier `deploy/` contient notamment :

- `server.js` — serveur Next.js standalone
- `app.js` — point d’entrée alternatif pour cPanel
- `start.sh` — script shell de démarrage
- `.next/` — build
- `public/` — assets statiques

## 4. Test en local avant push

```bash
npm run build:simple
cd deploy
set NODE_ENV=production
node server.js
```

Ouvrir http://localhost:3000

## 5. Domaine

Le workflow utilise **`sonounameto.aymart.bj`**. Si ton domaine est différent (ex. `sonounameto.aymat.bj`), modifie `DOMAIN` et `REMOTE_DIR` dans `.github/workflows/deploy-production.yml`.

## 6. HTTPS / proxy

Si le site est derrière Apache (cPanel), vérifie que le proxy vers le port Node est actif (souvent automatique avec *Setup Node.js App*). Sinon, contacte l’hébergeur pour lier le sous-domaine à l’app Node.
