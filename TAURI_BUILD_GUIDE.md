# ॐ Om-LifeOS — Tauri Desktop (Windows EXE) & Mobile (Android APK) Build Guide

This repository is configured with **Tauri v2** to build:
1. **Windows Installer / Executable (`.exe`)** with offline storage, custom window decorations, snap layout integration, and system notifications.
2. **Android Mobile App (`.apk`)** with **all permissions enabled** (Full File Storage, Camera, Microphone, Exact Alarms, Wake Lock, and Push Notifications).

---

## 🚀 Option 1: Automatic Cloud Build via GitHub Actions (Recommended)

You don't need to install Rust, Android SDK, or NDK on your local machine! GitHub Actions will build both **Windows `.exe`** and **Android `.apk`** for you automatically.

### Method A: Push a Release Tag
Whenever you push a version tag to GitHub:
```bash
git tag v4.8.4
git push origin v4.8.4
```
GitHub Actions will automatically:
1. Build the **Windows `.exe` Setup Installer**.
2. Build the **Android `.apk` Mobile App**.
3. Create a GitHub Release with both download files attached!

### Method B: Manual Trigger from GitHub Website
1. Go to your GitHub repository in your browser.
2. Click the **Actions** tab at the top.
3. In the left sidebar, click **Build and Release Om-LifeOS**.
4. Click **Run workflow**, select the `main` branch, and click the green **Run workflow** button.
5. Once complete, download the artifacts directly from the workflow summary:
   - `Om-LifeOS-Windows-Installer` (`.exe`)
   - `Om-LifeOS-Android-APK` (`.apk`)

---

## 📱 Mobile Permissions Configured in `AndroidManifest.xml`

All required Android permissions are enabled in `src-tauri/gen/android/app/src/main/AndroidManifest.xml`:

| Category | Permission | Purpose in Om-LifeOS |
|---|---|---|
| **Storage (Full Access)** | `READ_EXTERNAL_STORAGE`<br>`WRITE_EXTERNAL_STORAGE`<br>`MANAGE_EXTERNAL_STORAGE`<br>`READ_MEDIA_IMAGES`<br>`READ_MEDIA_VIDEO`<br>`READ_MEDIA_AUDIO` | Importing/exporting backups, offline SQLite/IndexedDB snapshots, reading folders, and saving reports |
| **Microphone & Audio** | `RECORD_AUDIO`<br>`MODIFY_AUDIO_SETTINGS` | Voice Notes, voice commands, and sound synthesizer |
| **Camera** | `CAMERA` | Document scanner and photo receipt attachments |
| **Alarms & Clock** | `SCHEDULE_EXACT_ALARM`<br>`USE_EXACT_ALARM`<br>`WAKE_LOCK`<br>`VIBRATE`<br>`RECEIVE_BOOT_COMPLETED` | Executive alarms, timeline delay alerts, habit reminders firing even when the phone is locked or after restart |
| **Notifications** | `POST_NOTIFICATIONS`<br>`FOREGROUND_SERVICE`<br>`FOREGROUND_SERVICE_MEDIA_PLAYBACK` | Android 13+ status notifications and active ringtone playback |
| **Network** | `INTERNET`<br>`ACCESS_NETWORK_STATE`<br>`ACCESS_WIFI_STATE` | Local network peer-pairing and data sync |

---

## 💻 Option 2: Local Windows Build (.exe)

### Prerequisites on Windows
1. [Node.js](https://nodejs.org/) (v20+) or [Bun](https://bun.sh/)
2. [Rust](https://www.rust-lang.org/tools/install) (via `rustup`)
3. [Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

### Commands:
```bash
# 1. Install dependencies
bun install   # or: npm install

# 2. Build the Windows .exe installer
bun run tauri:build   # or: npm run tauri:build
```
Your Windows installer will be generated at:
```
src-tauri/target/release/bundle/nsis/Om-LifeOS_4.8.4_x64-setup.exe
```

---

## 🤖 Option 3: Local Android Build (.apk)

### Prerequisites for Android
1. Android Studio with **Android SDK** & **NDK** (version r26d recommended)
2. Java JDK 17
3. Rust Android target:
   ```bash
   rustup target add aarch64-linux-android
   ```
4. Set environment variables:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export NDK_HOME=$ANDROID_HOME/ndk/<version>
   ```

### Commands:
```bash
# 1. Install dependencies
bun install

# 2. Inject all permissions into Android manifest
node scripts/setup-android-permissions.js

# 3. Build Android APK
bun run tauri:android --apk
```
Your Android APK will be generated at:
```
src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk
```
