# Task: Build a Restaurant Website

Build the following in the existing `TangyWebAI/` project. Follow this spec exactly. Do not add features outside it.

## 1. Stack
- Vue 3 (`<script setup>`, Composition API), TypeScript strict, Vite, Vue Router, Pinia.
- Firebase modular SDK v9+ with Cloud Firestore.
- Tailwind CSS v4 via `@tailwindcss/vite`, and `@headlessui/vue` for accessible primitives. Do not add any other CSS framework.
- Vitest for tests, plus ESLint and Prettier (add them if they are missing).
- Remove the Vite template files: `HelloWorld.vue`, `TheWelcome.vue`, `WelcomeItem.vue`, `components/icons/`, `base.css` and the default styles.

## 2. Architecture
Imports go only downward:
```
views/components -> stores (Pinia) -> services -> src/firebase/index.ts
```
- `src/firebase/index.ts`
  - Initializes Firebase once.
  - Reads `import.meta.env.VITE_FIREBASE_*`.
  - Throws a clear error naming any missing variable.
  - Connects to the Firestore emulator when `VITE_USE_EMULATORS === 'true'`.
- `src/services/categoryService.ts` and `productService.ts`: all Firestore calls (list, create, update, delete). Components and stores never import Firestore directly.
- `src/stores/categoryStore.ts` and `productStore.ts`: state `items`, `loading`, `error`, plus actions that call the services.
- `src/types/`: `Product` and `Category` interfaces.
- `src/router/`: `/` (MenuView), `/manage` (ManageView, lazy-loaded) and a catch-all 404.
- `src/components/base/`: `BaseButton`, `BaseInput`, `BaseSelect`, `BaseModal` (wraps Headless UI `Dialog`), `Spinner`, `ErrorMessage`, `Toast`.

## 3. Firebase and Configuration
- All config lives in `.env` as: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_USE_EMULATORS`. Never hardcode values.
- Commit `.env.example` with placeholders. Gitignore `.env` and `.env.*` (except the example).
- Type the variables in `env.d.ts`.
- Create `firebase.json`, `firestore.rules` and `firestore.indexes.json`.
  - Rules: public read on `products` and `categories`.
  - Writes are open for now, with the comment `// TEMPORARY: restrict to admins when auth is added`.
  - Validate required fields and types on write.
- Create `scripts/seed.ts` to load sample categories (Appetizers, Mains, Desserts, Drinks) and about 12 products.
- Use typed Firestore converters for reads and writes.

## 4. Data Model
**`categories`**: `name` (required, unique case-insensitive, trimmed), `description?`, `sortOrder` (number), `createdAt`, `updatedAt`.

**`products`**: `name` (required), `description` (required), `price` (number >= 0), `categoryId` (required, references a category document), `imageUrl?`, `isAvailable` (boolean, default true), `createdAt`, `updatedAt`.

- Products store `categoryId`, never the category name.
- "All" is a UI-only option and is never stored.

## 5. Menu Page `/`
- Responsive product card grid: 1 column on mobile, 2 on tablet, 3 or more on desktop. Each card shows image, name, price, category name and a short description.
- Search input, debounced 300 ms. It matches name OR description, case-insensitive, partial.
- Category dropdown loaded from the `categories` collection.
  - The first option is **All** and it is the default.
  - Search and category combine with AND.
- Load data once and filter client-side.
- Show a result count. When nothing matches, show an empty state with a "Clear filters" button.
- Hide products where `isAvailable === false`.
- Clicking a card, or pressing Enter or Space on it, opens a details modal with a large image, name, price, category and full description.
  - Close with an X button, Esc or a backdrop click.
  - Use Headless UI `Dialog` (focus trap, scroll lock, focus returns on close).

## 6. Loading and Errors
- Show a spinner while products and categories load.
- If a Firestore load fails, show a friendly error with a **Retry** button. Log the technical detail to the console only.
- If only categories fail, the menu still works, the dropdown is disabled, and a notice is shown.
- During save and delete, disable the buttons and show a spinner. Show success and error toasts.

## 7. Menu Studio (admin page) `/manage` (no auth yet)
The admin page is called **Menu Studio**. The page heading is "Menu Studio" and the browser title is "Menu Studio | Tangy Restaurant".

Use Headless UI `TabGroup` with two tabs: **Products** and **Categories**.

**Products tab**
- Table of all products, including unavailable ones, with search and category filter.
- Create and Edit in a `Dialog` form with fields: name, description, price, category, image URL and an availability toggle.
  - The category `<select>` is loaded from the `categories` collection and has a required placeholder.
  - If no categories exist, show "Create a category first".
- Inline validation: required fields, price >= 0 with max 2 decimals, max lengths, valid URL.
- Delete with a confirmation dialog.

**Categories tab**
- Table with name, description, product count (number of products in the category) and sort order.
- Create, edit and delete. Names must be unique (case-insensitive) and trimmed.
- Block deleting a category that still has products. Show "Reassign or delete its N products first."
- Renaming a category must update the menu automatically, because products use `categoryId`.

**Notice**
- Show a banner: "Not protected: anyone with this URL can edit data."
- Link Menu Studio from the public header as "Menu Studio" (decision: reachable now, login comes later).
- Keep all write logic in services, so auth can be added later without refactoring.

## 8. Styling
- Tailwind v4: one `src/assets/main.css` with `@import "tailwindcss";`, plus an `@theme { }` block for brand colors, fonts and radius.
- Use theme tokens only. No hardcoded hex values in templates.
- Use utility classes in templates. Avoid `<style>` blocks except for rare animations.
- Mobile-first: base styles for small screens, then `sm:`, `md:` and `lg:` overrides.
- Visible focus rings on all interactive elements. Color contrast meets WCAG AA.

## 9. Non-Functional
- Works down to 320 px with no horizontal scroll. Meets WCAG AA: labels, alt text, keyboard support.
- Lazy-load the `/manage` route and images.
- Set the page title and meta description. Use semantic HTML.
- Vitest tests for:
  - search and category filter logic
  - services (mocked Firestore)
  - category delete blocking
- `README.md` covering setup, env vars, emulator, seeding and deploying to Firebase Hosting.

## 10. Out of Scope (do not build)
Authentication, orders, payments, reservations, Firebase Storage uploads.

## 11. Build Order
1. Cleanup and dependencies. Install router, pinia, firebase, tailwindcss, `@tailwindcss/vite`, `@headlessui/vue`, vitest and tooling. Configure Tailwind and the theme.
2. Env files, Firebase init, types, rules and `firebase.json`.
3. Services and stores.
4. Seed script.
5. Base UI components, then the Menu page (grid, search, filter, modal, spinner and error states).
6. Manage page: categories first, then products.
7. Tests, README and final checks.

## 12. Acceptance Checks
1. With a valid `.env`, the menu shows Firestore data. A missing env var gives a clear startup error. No secrets are committed.
2. Searching a word that appears only in a description still returns that product.
3. "All" shows everything. A specific category shows only its products. Both combine with search.
4. A new category appears in the product form dropdown and the menu dropdown without a code change.
5. A category with products cannot be deleted.
6. A spinner shows while loading. A simulated Firestore failure shows an error with Retry.
7. The details modal and manage forms use Headless UI `Dialog`.
8. Tailwind is the only CSS framework, and no template CSS remains.
9. The layout works at 320, 768 and 1280 px.
10. `npm run type-check`, `lint` and `test` all pass.

## 13. Rules for the Agent
- Don't add features, libraries or files outside this spec.
- Ask before changing any decision here.
- Report what was done after each build step.

## Assumed Defaults (change if needed)
- Unavailable products are hidden on the public page.
- Category deletion is blocked when products exist.
- Images are URL-only.
- The currency is USD.

## Recommended Later Additions
Admin authentication (high priority), Firebase Storage image upload, hours and location page, dietary tags, featured items, reservations.
