#!/usr/bin/env bash
set -euo pipefail

echo "============================================================"
echo " Mr Jarvis Sheru Bhai Myra Beast - APK & AAB Local Builder"
echo "============================================================"

if ! command -v java >/dev/null 2>&1; then
  echo "ERROR: Java JDK 21 is required. Install JDK 21 and re-run."
  exit 1
fi

echo "[1/4] Installing npm dependencies & Capacitor Android bridge..."
npm install
npm install --no-save @capacitor/core@^8.0.0 @capacitor/android@^8.0.0 @capacitor/cli@^8.0.0

echo "[2/4] Building production web bundle with relative ./ asset paths..."
npm run build
rm -rf android/app/src/main/assets/public
mkdir -p android/app/src/main/assets/public
cp -R dist/* android/app/src/main/assets/public/

echo "[3/4] Compiling Debug APK & Release AAB via Gradle..."
cd android
chmod +x gradlew
./gradlew assembleDebug bundleRelease
cd ..

echo "[4/4] Copying compiled .apk and .aab into src/releases/..."
mkdir -p src/releases
cp android/app/build/outputs/apk/debug/app-debug.apk src/releases/mr-jarvis-beast-debug.apk
cp android/app/build/outputs/bundle/release/app-release.aab src/releases/mr-jarvis-beast-release.aab

echo ""
echo "DONE! Compiled Android packages created in src/releases/:"
echo "  - APK (Phone Testing):       src/releases/mr-jarvis-beast-debug.apk"
echo "  - AAB (Google Play Console): src/releases/mr-jarvis-beast-release.aab"
