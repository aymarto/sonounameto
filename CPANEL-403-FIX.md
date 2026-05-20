# Réparer le 403 Forbidden (sonounameto.aymart.bj)

## Ce n’est pas le `.htaccess` dans `public/`

Le 403 vient presque toujours d’un fichier **caché** à la **racine de l’application** (le même dossier que `server.js`), pas dans `public/`.

Le déploiement FTP avec `delete: true` a pu **supprimer** le fichier que cPanel crée pour lancer Node.js (Passenger / LiteSpeed).

---

## Étape 1 — Afficher les fichiers cachés

Dans le **Gestionnaire de fichiers cPanel** :

1. Cliquez sur **Réglages** / **Settings** (en haut à droite).
2. Cochez **Afficher les fichiers cachés** / **Show Hidden Files**.
3. Enregistrez.

Retournez dans le dossier où se trouvent `server.js`, `package.json`, `.next`, `public`.

### Cherchez un fichier nommé `.htaccess` (à la racine, pas dans `public/`)

- **S’il est absent** → passez à l’étape 2.
- **S’il contient encore `CacheDisable public /`** → supprimez ce bloc ou supprimez tout le fichier, puis étape 2.

---

## Étape 2 — Régénérer la config Node.js (cPanel)

1. cPanel → **Setup Node.js App** / **Application Node.js**.
2. Ouvrez l’application du domaine **sonounameto.aymart.bj**.
3. Vérifiez :
   - **Application root** = dossier avec `server.js` (votre capture d’écran).
   - **Application startup file** = `server.js` (ou `app.js`).
   - **Node.js version** = 18 ou 20.
4. Cliquez sur **Save** / **Enregistrer** (même sans rien changer — cela recrée souvent le `.htaccess` Passenger).
5. **Run NPM Install**
6. **Restart** l’application (statut doit être **Running** / en cours d’exécution).

---

## Étape 3 — Vérifier le dossier `public/` sur le serveur

Votre capture montre `public` = **52 octets** seulement. Il devrait contenir un dossier **`images/`** avec les portraits.

Si `public/images` est vide ou absent :

1. Relancez un déploiement GitHub (`push` sur `production`).
2. Ou uploadez manuellement le dossier `public/images` depuis votre PC.

---

## Étape 4 — Cache LiteSpeed

1. **LiteSpeed Web Cache Manager** → **Purge All**.
2. Testez en **navigation privée** : https://sonounameto.aymart.bj

---

## Étape 5 — Si le 403 continue : recréer l’application Node

1. **Setup Node.js App** → notez le chemin du dossier (ex. `/home/xxx/sonounameto`).
2. **Stop** puis **Delete** l’application (ne supprime pas les fichiers si cPanel le propose — gardez les fichiers).
3. **Create Application** :
   - Node 18+
   - Application root = dossier avec `server.js`
   - URL = `sonounameto.aymart.bj`
   - Startup file = `server.js`
4. **Run NPM Install** → **Start**.

---

## Vérification

- https://sonounameto.aymart.bj/ doit répondre **200** (pas 403).
- https://sonounameto.aymart.bj/version.json doit afficher du JSON (après un build récent).

---

## Domaine pointe-t-il sur `public/` par erreur ?

cPanel → **Domains** → **sonounameto.aymart.bj** → **Document Root**.

- **Correct** : racine de l’app Node (là où est `server.js`), ou la valeur indiquée par **Setup Node.js App**.
- **Incorrect** : uniquement le sous-dossier `public/` → provoque un **403** (pas de `index.html`).

Si le document root est `.../public`, changez-le pour le dossier parent (celui de `server.js`) ou recréez l’app Node comme à l’étape 5.
