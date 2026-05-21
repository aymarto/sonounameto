# Déploiement — galerienounameto.aymart.bj

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

Les secrets Firebase **ne sont plus nécessaires dans GitHub** : configurez-les dans cPanel (voir ci-dessous).

## cPanel — variables Firebase (runtime)

Dans **Setup Node.js App → Environment variables**, ajoutez :

| Variable | Exemple |
|----------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `votre-projet.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `votre-projet` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `votre-projet.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123:web:abc` |

Puis **Save** et **Restart**. Vérifiez : `https://galerienounameto.aymart.bj/api/firebase-config` → `"configured": true`.

> Les clés Firebase client sont publiques par nature ; elles ne doivent simplement pas être commitées dans le dépôt. La sécurité repose sur **Authentication** et les **règles Firestore**.

### Firebase Console — domaine autorisé

Dans **Authentication → Settings → Authorized domains**, ajoutez :
- `galerienounameto.aymart.bj`

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

## Cache navigateur (téléphone / ordinateur)

**Un site ne peut pas effacer le cache des visiteurs** (sécurité des navigateurs). En revanche :

1. Le déploiement FTP utilise `delete: true` pour retirer les anciens fichiers JS sur le serveur.
2. Les pages HTML sont servies avec `Cache-Control: no-store`.
3. Chaque build génère `public/version.json` : si un visiteur a encore l’ancienne version ouverte, le site se recharge automatiquement une fois.

**Sur votre téléphone (une fois après déploiement)** :

- **Safari (iPhone)** : Réglages → Safari → Effacer historique et données de sites → confirmer, ou maintenir le bouton recharger dans la barre d’adresse → « Recharger sans le contenu en cache ».
- **Chrome (Android)** : ⋮ → Historique → Effacer les données de navigation → Images et fichiers en cache.

Puis rouvrez `https://galerienounameto.aymart.bj` et vérifiez que **Run NPM Install + Restart** ont bien été faits sur cPanel après le dernier push sur `production`.

## LiteSpeed Cache (cause fréquente sur mobile)

Si le site en production répond avec l’en-tête `Server: fastestcache` ou `s-maxage=31536000`, c’est **le cache du serveur** (pas seulement le téléphone) qui garde l’ancienne page.

**Après chaque déploiement sur cPanel :**

1. **LiteSpeed Web Cache Manager** (ou *Cache Manager*) → **Purge All** / *Vider tout le cache*
2. **Setup Node.js App** → **Restart**
3. Sur le téléphone : fermer l’onglet, rouvrir le site (ou navigation privée pour tester)

## ⚠️ Site en 403 Forbidden

Voir le guide détaillé **`CPANEL-403-FIX.md`** (copié dans `deploy/` à chaque build).

**Cause la plus fréquente :** le FTP avec `delete: true` a supprimé le **`.htaccess` caché** que cPanel génère à la **racine** (à côté de `server.js`) pour lancer Node.js — ce n’est **pas** le fichier dans `public/`.

**Réparation rapide :**

1. Gestionnaire de fichiers → **Afficher les fichiers cachés** → chercher `.htaccess` à côté de `server.js`.
2. **Setup Node.js App** → **Save** → **Run NPM Install** → **Restart**.
3. Vérifier que le **Document Root** du domaine n’est pas uniquement le sous-dossier `public/`.
4. **LiteSpeed** → Purge All.

Le workflow utilise maintenant `delete: false` pour ne plus effacer la config cPanel.
