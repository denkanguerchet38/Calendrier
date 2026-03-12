# 📅 Notre Famille

Calendrier familial partagé pour les familles Guerchet, Viney et Juszczak.

## Stack technique

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** pour le styling
- **Firebase Firestore** (accès serveur uniquement via Admin SDK)
- **Vercel** pour l'hébergement

## Installation locale

### 1. Cloner le projet

```bash
git clone https://github.com/ton-user/notre-famille.git
cd notre-famille
npm install
```

### 2. Configurer Firebase (depuis zéro)

1. Aller sur [console.firebase.google.com](https://console.firebase.google.com)
2. **Créer un projet** → Nommer : `notre-famille` → Désactiver Google Analytics
3. **Firestore Database** → Créer → Emplacement : `europe-west1` → Mode production
4. **Règles Firestore** → Coller ceci et publier :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. **Paramètres** → Comptes de service → Générer une nouvelle clé privée
6. Récupérer : `project_id`, `client_email`, `private_key`

### 3. Variables d'environnement

Copier le fichier d'exemple :

```bash
cp .env.local.example .env.local
```

Remplir `.env.local` :

```env
SITE_PASSWORD=GvJ-NotreFam!2026#
ADMIN_EMAIL=ton-email@gmail.com
SESSION_SECRET=une-chaine-aleatoire-de-64-caracteres-minimum-pour-signer-les-cookies

FIREBASE_ADMIN_PROJECT_ID=notre-famille-xxxxx
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@notre-famille-xxxxx.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nxxxxxx\n-----END PRIVATE KEY-----\n"
```

> 💡 Pour générer un SESSION_SECRET aléatoire :
> ```bash
> openssl rand -hex 32
> ```

### 4. Lancer en développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

**Identifiant :** `Famille`
**Mot de passe :** celui défini dans `SITE_PASSWORD`

## Déploiement sur Vercel

### 1. Pousser sur GitHub

```bash
git init
git add .
git commit -m "Initial commit - Notre Famille"
git remote add origin https://github.com/ton-user/notre-famille.git
git push -u origin main
```

### 2. Déployer sur Vercel

1. Aller sur [vercel.com](https://vercel.com) → New Project
2. Importer le repo GitHub `notre-famille`
3. **Variables d'environnement** → Ajouter :
   - `SITE_PASSWORD` → `GvJ-NotreFam!2026#`
   - `ADMIN_EMAIL` → `ton-email@gmail.com`
   - `SESSION_SECRET` → (générer avec `openssl rand -hex 32`)
   - `FIREBASE_ADMIN_PROJECT_ID` → (depuis Firebase)
   - `FIREBASE_ADMIN_CLIENT_EMAIL` → (depuis Firebase)
   - `FIREBASE_ADMIN_PRIVATE_KEY` → (depuis Firebase, avec les `\n`)
4. Deploy !

### 3. Domaine personnalisé (optionnel)

Dans Vercel → Settings → Domains → Ajouter ton domaine.

## Sécurité

- ✅ **Zéro clé Firebase côté client** — tout passe par les API Routes Next.js
- ✅ **Mot de passe vérifié côté serveur** — jamais dans le code
- ✅ **Cookie signé HMAC-SHA256** — impossible à falsifier
- ✅ **Firestore rules bloquent tout** — seul le Firebase Admin SDK peut accéder
- ✅ **Variables d'environnement Vercel** — jamais commitées sur GitHub

## Fonctionnalités

- 📅 Calendrier partagé (vue Jour / Semaine / Mois)
- 🏃 4 types d'événements colorés (Sport, Anniversaire, Vacances, Sortie)
- 👥 15 membres pré-configurés (3 familles)
- 💬 Commentaires sur les événements
- 🌙 Mode sombre (clair / sombre / système)
- 📱 Responsive (mobile, tablette, desktop)
- 🔒 Accès protégé par mot de passe

## Structure du projet

```
src/
├── app/              # Pages et API Routes (Next.js App Router)
├── components/       # Composants React
│   ├── calendar/     # Vues calendrier, EventCard, EventModal, Commentaires
│   ├── layout/       # Navbar
│   └── ui/           # Modal, ThemeToggle, MemberSelector
├── hooks/            # Hooks custom (useEvents, useMember, useTheme, useComments)
├── lib/              # Firebase Admin, gestion session
├── types/            # Types TypeScript
└── constants/        # Membres, types d'événements
```

---

Fait avec ❤️ pour les familles Guerchet, Viney et Juszczak.
