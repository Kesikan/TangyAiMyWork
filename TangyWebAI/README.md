# Tangy Restaurant Website

Vue 3 + TypeScript + Vite menu site backed by Cloud Firestore. Visitors can browse, search and filter the menu. `/manage` provides CRUD for products and categories.

> `/manage` has **no authentication yet**. Anyone with the URL can edit data, and `firestore.rules` currently allows open writes (marked `TEMPORARY`). Add admin auth and lock the rules before going public.

## Stack

Vue 3, TypeScript, Vite, Vue Router, Pinia, Firebase (modular SDK, Firestore), Tailwind CSS v4, Headless UI, Vitest.

## Setup

```sh
npm install
cp .env.example .env   # then fill in your values
```

### Environment variables

All Firebase config comes from `.env` (never committed). See `.env.example`:

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |
| `VITE_USE_EMULATORS` | `true` to use the local Firestore emulator |

The app throws an error naming any missing variable at startup. The web API key is not a secret. Data is protected by Firestore security rules.

## Local development with the emulator

Requires the [Firebase CLI](https://firebase.google.com/docs/cli) and Java.

```sh
# set VITE_USE_EMULATORS=true in .env (a demo-* project ID needs no real project)
firebase emulators:start --only firestore   # terminal 1
npm run seed                                # terminal 2, loads sample data (skips if data exists)
npm run dev
```

Emulator UI: http://localhost:4000

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Type-check and build |
| `npm run type-check` | `vue-tsc` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm test` | Vitest |
| `npm run seed` | Seed categories and products |

## Data model

- `categories`: `name`, `nameKey` (lowercased name for case-insensitive uniqueness), `description?`, `sortOrder`, `createdAt`, `updatedAt`
- `products`: `name`, `description`, `price`, `categoryId`, `imageUrl?`, `isAvailable`, `createdAt`, `updatedAt`

Uniqueness of category names is enforced in the service layer, so two simultaneous writes could still race.

## Architecture

```
views/components -> stores (Pinia) -> services -> src/firebase/index.ts
```

Components and stores never import Firestore directly.

## Deploying to Firebase Hosting

```sh
firebase login
firebase use <your-project-id>
npm run build
firebase deploy --only firestore:rules,firestore:indexes,hosting
```

Set the `VITE_FIREBASE_*` values for the production project in `.env` before building.
