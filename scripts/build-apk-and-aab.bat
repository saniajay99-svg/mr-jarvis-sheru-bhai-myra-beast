@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo  Mr Jarvis Sheru Bhai Myra Beast - APK ^& AAB Local Builder
echo ============================================================

where java >nul 2>nul
if errorlevel 1 (
  echo ERROR: Java JDK 21 is required. Install JDK 21 and Android SDK, then re-run.
  exit /b 1
)

echo [1/4] Installing npm dependencies ^& Capacitor Android bridge...
call npm install
call npm install --no-save @capacitor/core@^8.0.0 @capacitor/android@^8.0.0 @capacitor/cli@^8.0.0

echo [2/4] Building production web bundle with relative ./ asset paths...
call npm run build
if exist android\app\src\main\assets\public rmdir /s /q android\app\src\main\assets\public
mkdir android\app\src\main\assets\public
xcopy /E /I /Y dist\* android\app\src\main\assets\public\

echo [3/4] Compiling Debug APK ^& Release AAB via Gradle...
cd android
call gradlew.bat assembleDebug bundleRelease
cd ..

echo [4/4] Copying compiled .apk and .aab into src\releases\...
if not exist src\releases mkdir src\releases
copy /Y android\app\build\outputs\apk\debug\app-debug.apk src\releases\mr-jarvis-beast-debug.apk
copy /Y android\app\build\outputs\bundle\release\app-release.aab src\releases\mr-jarvis-beast-release.aab

echo.
echo DONE! Compiled Android packages created in src\releases\:
echo   - APK (Phone Testing):       src\releases\mr-jarvis-beast-debug.apk
echo   - AAB (Google Play Console): src\releases\mr-jarvis-beast-release.aab
