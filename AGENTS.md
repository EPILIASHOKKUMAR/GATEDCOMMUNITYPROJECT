This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Architecture & Project Structure (`src/`)

The application strictly follows a decoupled, modular design pattern. **Do NOT use `src/app/`** — Expo Router is configured with `./src/routes` as its root in `app.json`.

```
src/
├── routes/        # Thin Expo Router entry points (delegates only, NO business/UI logic)
│   ├── _layout.tsx    # Root stack navigator & screen registrations
│   ├── index.tsx      # Entry route delegating to LandingPage
│   ├── home.tsx       # Route delegating to HomePage
│   ├── menu.tsx       # Route delegating to MenuPage
│   ├── protect.tsx    # Route delegating to ProtectPage
│   ├── settings.tsx   # Route delegating to SettingsPage
│   ├── explore.tsx    # Route delegating to ExplorePage
│   └── +not-found.tsx # 404 route delegating to NotFoundPage
├── pages/         # Full screen components & page-level state/business logic
│   ├── LandingPage.tsx
│   ├── HomePage.tsx
│   ├── MenuPage.tsx
│   ├── ProtectPage.tsx
│   ├── SettingsPage.tsx
│   ├── ExplorePage.tsx
│   ├── NotFoundPage.tsx
│   └── index.ts       # Central barrel export for all pages
├── components/    # Reusable UI components (AppButton, AppInput, HeroCard, etc.)
├── theme/         # Unified design tokens (colors, spacing, radii, typography, shadows)
│   └── index.ts       # Single source of truth for app theme
├── utils/         # Pure helper functions, formatters, and validation logic
│   ├── validators.ts
│   └── index.ts
└── constants/     # Application constants (re-exports from @/theme)
```

### Architectural Rules
1. **Routes (`src/routes/`)**: Every route file MUST be a thin delegate that re-exports its corresponding page from `@/pages` (e.g., `export { default } from '@/pages/HomePage';`). Do NOT place JSX or screen state inside `src/routes/`.
2. **Pages (`src/pages/`)**: Contains full screen components. Export every page both as default and named export, and register it in `src/pages/index.ts`.
3. **Theme (`src/theme/`)**: Always import `colors`, `spacing`, `radii`, `typography`, and `shadows` from `@/theme`. Avoid hardcoding arbitrary hex colors or spacing values.
4. **Path Aliases**:
   - `@/*` → `./src/*`
   - `@/assets/*` → `./assets/*`

## Navigation & Routing

- Expo Router root is `./src/routes` (set in `app.json`: `plugins: [["expo-router", { "root": "./src/routes" }]]`).
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Every screen in the stack must be registered in `src/routes/_layout.tsx` (e.g., `<Stack.Screen name="protect" options={{ headerShown: false }} />`).
- Docs: https://docs.expo.dev/router/introduction.md

## Safe Area & Bottom Navigation Pattern

- **Avoid system UI collision**: Screens with bottom navigation or bottom action bars must account for Android 3-button navigation bars and iOS home indicators.
- Use `<SafeAreaView edges={["top", "bottom"]}>` (or `useSafeAreaInsets()`) so that the bottom navigation sits properly above system navigation buttons.
- Bottom navigation bars should use consistent dimensions matching the design pattern: `paddingVertical: 12`, item `minHeight: 44`, and border color `#E5ECF3` / `#E6ECF2` on white backgrounds.

## Tooling & Workflow

- Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Native Code Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
