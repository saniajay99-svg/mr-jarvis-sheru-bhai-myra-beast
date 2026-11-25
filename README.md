# 👑 Mr Jarvis Beast — Android App

Dedicated personal voice assistant and private secretary application designed exclusively for master **Aijay Boss** (`com.aijayboss.mrjarvisbeast`).

---

## 🚀 Automated GitHub Actions CI/CD (Debug APK & GitHub Releases)

The repository includes a production-grade automated GitHub Actions workflow at [`.github/workflows/build-apk.yml`](.github/workflows/build-apk.yml).

### ✨ What It Does:
1. **Triggers Automatically**:
   - Every `push` to `main` or `master` branches
   - Every version tag push (e.g. `v1.0.0`, `v1.0.1`)
   - Every `pull_request` to `main` or `master`
   - Manual 1-click execution under the GitHub **Actions** tab (`Run workflow`)
2. **Build Environment**:
   - **Runner**: `ubuntu-latest`
   - **Node.js**: `20.x`
   - **JDK**: `21` (Eclipse Temurin)
   - **Android Gradle Plugin (AGP)**: `8.13.0` (`com.android.tools.build:gradle:8.13.0`)
   - **Gradle**: `8.14.3`
   - **Compile SDK**: `36` (Android 16) | **Min SDK**: `24` (Android 7.0)
3. **Build Pipeline**:
   - `npm ci || npm install`
   - `npm run build` (builds web assets)
   - `npx cap sync android` (syncs assets into Android project)
   - `cd android && ./gradlew assembleDebug --stacktrace` (compiles native debug APK)
   - Calculates file size and SHA-256 integrity hash
4. **Direct Download Distribution**:
   - **GitHub Releases**: Automatically publishes a release with the direct downloadable file `MrJarvisBeast-v1.0-debug.apk`.
   - **Actions Artifacts**: Uploads `mr-jarvis-beast-debug-apk` directly to the workflow run summary for 30-day instant download.

---

## 📥 How to Download the Built APK

### Method 1: From GitHub Releases (Direct Phone Install)
1. Navigate to the **Releases** tab on your GitHub repository.
2. Under **Assets**, click **`MrJarvisBeast-v1.0-debug.apk`** to download directly to your Android device.
3. Tap the downloaded file to install on your phone.

### Method 2: From GitHub Actions Workflow Runs
1. Go to the **Actions** tab on your repository.
2. Select the latest **"Build & Release Android Debug APK"** run.
3. Scroll down to the **Artifacts** section and download **`mr-jarvis-beast-debug-apk`**.

---

## 🛠️ Local Build Instructions

If compiling locally on your machine with JDK 21 and Android SDK:

```bash
# 1. Install dependencies
npm install

# 2. Build web bundle & sync with Capacitor
npm run build
npx cap sync android

# 3. Assemble Debug APK
cd android
./gradlew assembleDebug --stacktrace
```

The compiled APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```
