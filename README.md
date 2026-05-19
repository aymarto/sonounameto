# SONOUNAMETO — Galerie de l'artiste

Site vitrine multi-pages pour l'artiste **SONOUNAMETO**, avec un **dashboard d'administration** complet (galerie, évènements, hero) protégé par authentification Firebase.

Stack : Next.js 14 (App Router) · TypeScript · Tailwind CSS · Firebase (Auth + Firestore + Storage).

## Structure des routes

```
app/
├── (site)/              # Site public (Navbar + Footer)
│   ├── page.tsx         # Accueil
│   ├── galerie/
│   ├── evenements/
│   ├── a-propos/
│   └── contact/
├── login/               # Page de connexion (pas de shell)
└── admin/               # Dashboard (sidebar, protégé par auth)
    ├── page.tsx         # Tableau de bord
    ├── galerie/
    │   ├── page.tsx           # Liste des œuvres
    │   ├── nouvelle/          # Création
    │   └── [id]/              # Édition / suppression
    ├── evenements/
    │   ├── page.tsx           # Liste des évènements
    │   ├── nouveau/           # Création
    │   └── [id]/              # Édition / suppression
    └── hero/                  # Gestion de l'image et des textes du hero
```

## Démarrer

```bash
npm install
cp .env.local.example .env.local
# … renseigner les variables Firebase dans .env.local
npm run dev
```

Site public : [http://localhost:3000](http://localhost:3000)
Connexion : [http://localhost:3000/login](http://localhost:3000/login)
Dashboard : [http://localhost:3000/admin](http://localhost:3000/admin)

## Configurer Firebase

### 1. Créer un projet

1. Aller sur [console.firebase.google.com](https://console.firebase.google.com) et créer un projet.
2. Ajouter une **application Web** (icône `</>`). Copier les clés de config.
3. Coller les valeurs dans `.env.local` :

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 2. Activer Authentication

- Dans la console Firebase : **Authentication > Sign-in method > Email/Password** : activer.
- **Authentication > Users > Add user** : créer le compte admin (email + mot de passe).

### 3. Activer Firestore

- **Firestore Database > Create database** (mode production, région au choix).
- Collections utilisées par l'app (créées automatiquement à la première écriture) :
  - `artworks` — les œuvres de la galerie
  - `events` — les évènements
  - `settings/hero` — configuration du hero (image + textes)

### 4. Activer Cloud Storage

- **Storage > Get started**.
- L'app stocke les images dans `artworks/`, `events/`, `hero/`.

### 5. Règles de sécurité (à appliquer)

> ⚠️ À configurer avant la mise en production.

**Firestore** :
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Lecture publique
    match /artworks/{doc}    { allow read: if true; allow write: if request.auth != null; }
    match /events/{doc}      { allow read: if true; allow write: if request.auth != null; }
    match /settings/{doc}    { allow read: if true; allow write: if request.auth != null; }
  }
}
```

**Storage** :
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Pour restreindre l'écriture à un seul email :
```
allow write: if request.auth != null && request.auth.token.email == "admin@exemple.com";
```

## Dashboard — fonctionnalités

- **Connexion** : email + mot de passe (Firebase Auth). Redirige vers `/admin`.
- **Tableau de bord** : compteurs (œuvres, évènements) et raccourcis.
- **Galerie** : liste en grille, création (image, titre, description courte/longue, date, médium, dimensions), édition, suppression. L'image est stockée sur Firebase Storage.
- **Évènements** : liste, création (image optionnelle, titre, lieu, dates début/fin, description), édition, suppression.
- **Hero** : modification de l'image de fond, du titre, du sous-titre et de la description. Aperçu en direct.
- **Déconnexion** : bouton en haut à droite.

## Prochaines étapes proposées

1. **Brancher les pages publiques** sur Firestore (actuellement, elles utilisent des données d'exemple statiques dans `lib/data.ts`).
2. **Restreindre Firebase Auth à un seul email** via les règles Firestore/Storage.
3. **Pages de détail** : `/galerie/[id]` et `/evenements/[id]`.
4. **Newsletter & contact** : enregistrer les soumissions dans Firestore (collections `newsletter`, `messages`).
5. **Réordonnancement** des œuvres et évènements via drag-and-drop dans l'admin.
