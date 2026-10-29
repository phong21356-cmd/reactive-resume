# CLAUDE.md

This file provides guidance to Claude Code (`claude.ai/code`) and other AI coding agents when working in this repository.

## Project Overview

**Reactive Resume (Android & Web Studio Edition)** is a self-contained React 19 + TypeScript + Tailwind CSS v4 + Vite Progressive Web App (PWA) and Android APK build studio based on Reactive Resume (`apps/mobile` and `apps/web`).

It runs out-of-the-box on port `3000` without external database or Docker dependencies, persists user state in `localStorage`, supports full offline Android WebAPK installation via `vite-plugin-pwa`, and includes an in-app **Android Studio Project (`.zip`) Generator** that outputs a complete Kotlin + Gradle (SDK 35) Android project.

---

## Quick Commands

```bash
# Start development server on port 3000
npm run dev

# Typecheck the codebase
npm run lint

# Build production bundle + PWA Service Worker (dist/)
npm run build

# Run decoupled unit test suite (Node built-in test runner via tsx)
npx tsx --test src/utils/logic.test.ts
```

---

## Repository Architecture

### Active Root Application (`/src`)
The root application is a self-contained Vite SPA + PWA that unifies the 5 primary screens from `apps/mobile` and `apps/web`:

- `src/App.tsx` — Main responsive shell:
  - Desktop (`>= 1024px`): Split-screen workspace on the left (`50%`) + live A4 document preview or interactive **Pixel 9 Pro** Android device frame on the right (`50%`).
  - Mobile (`< 768px`): Compact `48px` top app bar + `64px` 5-tab bottom navigation bar (`Documents`, `Builder`, `Applications`, `Career`, `Android APK`).
- `src/types/resume.ts` — Core domain models (`Resume`, `CoverLetter`, `JobApplication`, `ApplicationStage`, `CareerStory`, `JobOffer`).
- `src/data/initialData.ts` — Seed resumes, cover letter, job applications, STAR stories, and compensation offers (`localStorage` keys prefixed with `rxresume_android_v2_*`).
- `src/utils/` — Pure, decoupled business logic modules:
  - `src/utils/atsEngine.ts` — `extractResumeCorpus()`, `analyzeJobMatch()`, and `injectSkillKeyword()` for ATS keyword scoring and 1-tap missing skill injection.
  - `src/utils/applicationTracker.ts` — `computeApplicationMetrics()`, `advanceApplicationStage()`, and `calculateOfferTotalComp()` for job pipeline analytics and offer math.
  - `src/utils/androidProjectBuilder.ts` — `generateAndroidProjectFiles()` producing Kotlin + Jetpack WebView / Trusted Web Activity (TWA) + Capacitor Android project files (`settings.gradle.kts`, `build.gradle.kts`, `app/build.gradle.kts`, `app/src/main/AndroidManifest.xml`, `MainActivity.kt`, `assetlinks.json`, `capacitor.config.json`, `README-ANDROID.md`).
  - `src/utils/logic.test.ts` — Unit test suite covering ATS engine, application tracker, offer calculator, and Android project generator.
- `src/components/mobile/` — Feature screens matching `apps/mobile`:
  - `DocumentsScreen.tsx` — Resume & cover letter collection with search, filter (`All`, `Resumes`, `Letters`), creation modal, duplication, and deletion.
  - `ApplicationsScreen.tsx` — Job application pipeline tracker (`Saved`, `Applied`, `Interviewing`, `Offer`, `Archived`) with metrics and 1-tap stage advancement.
  - `CareerScreen.tsx` — Total Compensation Offer Calculator (Base + Equity + Bonus + Sign-on) and STAR Behavioral Interview Story Bank.
  - `AndroidStudioPanel.tsx` — Android WebAPK installer, Pixel 9 Pro frame toggle, Android Manifest/Gradle configuration form, live source code inspector, and `.zip` exporter (powered by `fflate`).
- `src/components/ats/AtsChecker.tsx` — Job description keyword matcher with 1-tap `+ keyword` injection into the active resume.
- `src/components/templates/` — Live A4 document renderers:
  - `ResumeRenderer.tsx` — Supports `Modern`, `Classic`, and `Minimal` layouts, custom accent colors, and `@media print` A4 export.
  - `CoverLetterRenderer.tsx` — Synchronized A4 cover letter preview.
- `src/hooks/usePWAInstall.ts` — Hooks for `beforeinstallprompt` (`usePWAInstall`) and real-time online/offline detection (`useOnlineStatus`).

### Reference Upstream Directories (`/apps`)
- `apps/mobile/` — Upstream Expo / React Native reference implementation.
- `apps/web/` — Upstream TanStack Router web app reference.
- `apps/server/` — Upstream Hono API server reference.

---

## Android Build & Packaging Workflows

### 1. Android WebAPK / PWA (Instant Install)
Configured in `vite.config.ts` via `vite-plugin-pwa`:
- Generates `manifest.webmanifest` and Workbox Service Worker (`sw.js`).
- Icons in `public/`: `pwa-192x192.png`, `pwa-512x512.png`, `pwa-maskable-512x512.png`, `apple-touch-icon.png`.
- Users opening the deployed URL in Chrome for Android can install it directly as a standalone Android application.

### 2. Native Android Studio APK / AAB Build
1. Open the **Android APK** tab in the app and click **Download Android Studio (.zip)** (or call `generateAndroidProjectFiles()` in `src/utils/androidProjectBuilder.ts`).
2. Extract `reactive-resume-android-studio.zip` and open the directory in **Android Studio Ladybug (2024.2.1)+** with JDK 17 and Android SDK 35.
3. Build commands inside the exported Android project:
   ```bash
   # Build installable debug APK (app/build/outputs/apk/debug/app-debug.apk)
   ./gradlew assembleDebug

   # Build Google Play Store release bundle (app/build/outputs/bundle/release/app-release.aab)
   ./gradlew bundleRelease
   ```

---

## Coding Conventions
- **TypeScript**: Strict typing (`npm run lint` runs `tsc --noEmit`). Keep pure domain calculations in `src/utils/` so they remain testable under Node without DOM mocks.
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` in `src/index.css`). Maintain high-contrast dark slate surfaces (`bg-slate-950` / `bg-slate-900`) for the workspace shell and crisp print-accurate white A4 surfaces for document previews.
- **Touch Ergonomics**: Keep interactive controls at `min-h-[40px]` / `min-h-[44px]` for mobile touch accuracy, and preserve the `<= 15%` sticky header/footer height budget on mobile viewports (`390x844`).
