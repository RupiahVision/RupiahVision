param(
  [string]$OutputApk,
  [string]$DriveLetter = "R",
  [switch]$CleanPrebuild,
  [switch]$CleanNative
)

$ErrorActionPreference = "Stop"

function Write-Step($Message) {
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Ensure-Directory($Path) {
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Force -Path $Path | Out-Null
  }
}

function Download-File($Uri, $OutFile) {
  if (Test-Path -LiteralPath $OutFile) {
    return
  }

  Ensure-Directory (Split-Path -Parent $OutFile)
  Write-Step "Downloading $Uri"
  curl.exe -L -o $OutFile $Uri
}

function Expand-ZipIfMissing($ZipFile, $Destination, $ExpectedDirectory) {
  if (Test-Path -LiteralPath $ExpectedDirectory) {
    return
  }

  Ensure-Directory $Destination
  Expand-Archive -LiteralPath $ZipFile -DestinationPath $Destination -Force
}

function Replace-InFile($Path, $Pattern, $Replacement) {
  $content = [System.IO.File]::ReadAllText($Path)
  $updated = [System.Text.RegularExpressions.Regex]::Replace($content, $Pattern, $Replacement)
  if ($updated -ne $content) {
    [System.IO.File]::WriteAllText($Path, $updated)
  }
}

function Ensure-CleartextTraffic($ManifestPath) {
  $content = [System.IO.File]::ReadAllText($ManifestPath)
  if ($content.Contains("android:usesCleartextTraffic=")) {
    return
  }

  $updated = $content.Replace("<application ", '<application android:usesCleartextTraffic="true" ')
  [System.IO.File]::WriteAllText($ManifestPath, $updated)
}

function Ensure-ManifestPermission($ManifestPath, $PermissionName) {
  $content = [System.IO.File]::ReadAllText($ManifestPath)
  $permission = "<uses-permission android:name=`"android.permission.$PermissionName`"/>"
  if ($content.Contains($permission)) {
    return
  }

  $updated = $content.Replace("<queries>", "$permission`r`n  <queries>")
  [System.IO.File]::WriteAllText($ManifestPath, $updated)
}

function Ensure-Arm64AbiFilter($BuildGradlePath) {
  $content = [System.IO.File]::ReadAllText($BuildGradlePath)
  if ($content.Contains("RupiahVision arm64-only release")) {
    return
  }

  $replacement = @'
    defaultConfig {
        // RupiahVision arm64-only release.
        ndk {
            abiFilters "arm64-v8a"
        }
'@
  $updated = $content.Replace("    defaultConfig {", $replacement)
  [System.IO.File]::WriteAllText($BuildGradlePath, $updated)
}

function Ensure-CMakeSingleJob($CMakePath) {
  $content = [System.IO.File]::ReadAllText($CMakePath)
  if ($content.Contains("RupiahVision native build memory guard")) {
    return
  }

  $guard = @'

# RupiahVision native build memory guard.
set_property(GLOBAL PROPERTY JOB_POOLS compile_pool=1 link_pool=1)
set(CMAKE_JOB_POOL_COMPILE compile_pool)
set(CMAKE_JOB_POOL_LINK link_pool)
'@
  $updated = $content.Replace("project(expo-modules-core)", "project(expo-modules-core)$guard")
  [System.IO.File]::WriteAllText($CMakePath, $updated)
}

function Ensure-StaticGradleSettings($SettingsPath) {
  $content = [System.IO.File]::ReadAllText($SettingsPath)
  if ($content.Contains("RupiahVision static Gradle settings")) {
    return
  }

  $updated = [System.Text.RegularExpressions.Regex]::Replace(
    $content,
    "pluginManagement\s*\{[\s\S]*?\}\r?\nplugins",
    "pluginManagement {`r`n    // RupiahVision static Gradle settings.`r`n    includeBuild(`"../node_modules/@react-native/gradle-plugin`")`r`n}`r`nplugins"
  )
  $updated = [System.Text.RegularExpressions.Regex]::Replace(
    $updated,
    "from\(files\(new File\(\[[\s\S]*?\]\.execute\(null, rootDir\)\.text\.trim\(\), `"../gradle/libs\.versions\.toml`"\)\)\)",
    "from(files(new File(rootDir, `"../node_modules/react-native/gradle/libs.versions.toml`")))"
  )
  $updated = [System.Text.RegularExpressions.Regex]::Replace(
    $updated,
    "apply from: new File\(\[[\s\S]*?\]\.execute\(null, rootDir\)\.text\.trim\(\), `"../scripts/autolinking\.gradle`"\);",
    "apply from: new File(rootDir, `"../node_modules/expo/scripts/autolinking.gradle`");"
  )
  $updated = [System.Text.RegularExpressions.Regex]::Replace(
    $updated,
    "includeBuild\(new File\(\[[\s\S]*?\]\.execute\(null, rootDir\)\.text\.trim\(\)\)\.getParentFile\(\)\)",
    "includeBuild(`"../node_modules/@react-native/gradle-plugin`")"
  )

  [System.IO.File]::WriteAllText($SettingsPath, $updated)
}

$FrontendRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$ProjectRoot = Resolve-Path (Join-Path $FrontendRoot "..")
$WorkspaceRoot = Resolve-Path (Join-Path $ProjectRoot "..\..")

if (-not $OutputApk) {
  $OutputApk = Join-Path $WorkspaceRoot "RupiahVision-release-arm64-v8a.apk"
}

$ToolsRoot = Join-Path $WorkspaceRoot "work\apk-build-tools"
$ExistingJdkRoot = Join-Path $WorkspaceRoot "work\jdk\jdk-17.0.19+10"
$ExistingNodeRoot = Join-Path $WorkspaceRoot "work\node20\node-v20.19.5-win-x64"
$JdkRoot = if (Test-Path -LiteralPath $ExistingJdkRoot) { $ExistingJdkRoot } else { Join-Path $ToolsRoot "jdk-17.0.19+10" }
$NodeRoot = if (Test-Path -LiteralPath $ExistingNodeRoot) { $ExistingNodeRoot } else { Join-Path $ToolsRoot "node-v20.19.5-win-x64" }
$AndroidSdkRoot = Join-Path $WorkspaceRoot "work\android-sdk"
$CmdlineToolsRoot = Join-Path $AndroidSdkRoot "cmdline-tools\latest"
$GradleUserHome = Join-Path $WorkspaceRoot "work\gradle-home"
$BuildTempRoot = Join-Path $WorkspaceRoot "work\temp"

Write-Step "Preparing portable JDK 17"
if (-not (Test-Path -LiteralPath $JdkRoot)) {
  $jdkZip = Join-Path $ToolsRoot "temurin17.zip"
  Download-File "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse" $jdkZip
  Expand-ZipIfMissing $jdkZip $ToolsRoot $JdkRoot
}

Write-Step "Preparing portable Node 20"
if (-not (Test-Path -LiteralPath $NodeRoot)) {
  $nodeZip = Join-Path $ToolsRoot "node20.zip"
  Download-File "https://nodejs.org/dist/v20.19.5/node-v20.19.5-win-x64.zip" $nodeZip
  Expand-ZipIfMissing $nodeZip $ToolsRoot $NodeRoot
}

Write-Step "Preparing Android command-line tools"
if (-not (Test-Path -LiteralPath (Join-Path $CmdlineToolsRoot "bin\sdkmanager.bat"))) {
  $toolsZip = Join-Path $ToolsRoot "commandlinetools.zip"
  Download-File "https://dl.google.com/android/repository/commandlinetools-win-14742923_latest.zip" $toolsZip
  $cmdlineParent = Join-Path $AndroidSdkRoot "cmdline-tools"
  Ensure-Directory $cmdlineParent
  $tmpTools = Join-Path $cmdlineParent "cmdline-tools"
  if (Test-Path -LiteralPath $tmpTools) {
    Remove-Item -LiteralPath $tmpTools -Recurse -Force
  }
  if (Test-Path -LiteralPath $CmdlineToolsRoot) {
    Remove-Item -LiteralPath $CmdlineToolsRoot -Recurse -Force
  }
  Expand-Archive -LiteralPath $toolsZip -DestinationPath $cmdlineParent -Force
  Rename-Item -LiteralPath $tmpTools -NewName "latest"
}

$env:JAVA_HOME = $JdkRoot
$env:NODE_HOME = $NodeRoot
$env:ANDROID_HOME = $AndroidSdkRoot
$env:ANDROID_SDK_ROOT = $AndroidSdkRoot
$env:GRADLE_USER_HOME = $GradleUserHome
$env:TEMP = $BuildTempRoot
$env:TMP = $BuildTempRoot
$env:NODE_ENV = "production"
$env:CI = "true"
$env:MAX_WORKERS = "1"
$env:CMAKE_BUILD_PARALLEL_LEVEL = "1"
$env:NODE_OPTIONS = "--max-old-space-size=1024"
$env:GRADLE_OPTS = "-Xss1m -XX:TieredStopAtLevel=1 -XX:ReservedCodeCacheSize=96m -XX:+UseSerialGC"
$env:KOTLIN_COMPILER_EXECUTION_STRATEGY = "in-process"
$env:Path = "$NodeRoot;$JdkRoot\bin;$AndroidSdkRoot\platform-tools;$AndroidSdkRoot\cmdline-tools\latest\bin;$AndroidSdkRoot\tools\bin;$env:Path"

Ensure-Directory $GradleUserHome
Ensure-Directory $BuildTempRoot

Write-Step "Accepting Android SDK licenses"
Ensure-Directory (Join-Path $AndroidSdkRoot "licenses")
1..100 | ForEach-Object { "y" } | & "$AndroidSdkRoot\cmdline-tools\latest\bin\sdkmanager.bat" --licenses | Out-Null

Write-Step "Installing Android SDK 36 and NDK 27 on drive D"
& "$AndroidSdkRoot\cmdline-tools\latest\bin\sdkmanager.bat" `
  "platform-tools" `
  "platforms;android-36" `
  "build-tools;36.0.0" `
  "ndk;27.1.12297006" `
  "cmake;3.22.1"
if ($LASTEXITCODE -ne 0) {
  throw "Android SDK component installation failed with exit code $LASTEXITCODE"
}

Push-Location $FrontendRoot
try {
  if (-not (Test-Path -LiteralPath "node_modules")) {
    Write-Step "Installing npm dependencies"
    npm.cmd ci
  }

  if ($CleanPrebuild -or -not (Test-Path -LiteralPath "android")) {
    Write-Step "Generating Android native project"
    npx.cmd expo prebuild --platform android --clean --no-install
  }

  Write-Step "Applying build compatibility patches"
  $manifestFile = "android\app\src\main\AndroidManifest.xml"
  Ensure-CleartextTraffic $manifestFile
  Ensure-ManifestPermission $manifestFile "INTERNET"
  Ensure-ManifestPermission $manifestFile "CAMERA"
  Ensure-ManifestPermission $manifestFile "READ_EXTERNAL_STORAGE"
  Ensure-ManifestPermission $manifestFile "WRITE_EXTERNAL_STORAGE"
  Ensure-ManifestPermission $manifestFile "READ_MEDIA_IMAGES"
  Ensure-ManifestPermission $manifestFile "READ_MEDIA_VISUAL_USER_SELECTED"
  Ensure-Arm64AbiFilter "android\app\build.gradle"

  $cmakeFile = "node_modules\expo-modules-core\android\CMakeLists.txt"
  Replace-InFile $cmakeFile "(?m)^  -O2\r?\n" "  -O0`r`n  -g0`r`n"
  Ensure-CMakeSingleJob $cmakeFile

  if ($CleanNative) {
    Write-Step "Cleaning native CMake cache"
    Remove-Item -LiteralPath "node_modules\expo-modules-core\android\.cxx" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath "android\app\.cxx" -Recurse -Force -ErrorAction SilentlyContinue
  }
  Remove-Item -LiteralPath "android\app\build\outputs\apk\release\app-release.apk" -Force -ErrorAction SilentlyContinue

  Write-Step "Building release APK"
  Push-Location "android"
  try {
    .\gradlew.bat --no-daemon `
      "-Dorg.gradle.jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=512m -Xss1m -XX:TieredStopAtLevel=1 -XX:ReservedCodeCacheSize=128m -XX:+UseSerialGC" `
      "-Pkotlin.compiler.execution.strategy=in-process" `
      "-Pkotlin.incremental=false" `
      "-Dorg.gradle.parallel=false" `
      "-Dorg.gradle.workers.max=1" `
      "-PreactNativeArchitectures=arm64-v8a" `
      -x lintVitalAnalyzeRelease `
      -x lintVitalReportRelease `
      -x lintVitalRelease `
      assembleRelease
    if ($LASTEXITCODE -ne 0) {
      throw "Gradle build failed with exit code $LASTEXITCODE"
    }
  }
  finally {
    Pop-Location
  }

  $apk = Join-Path $FrontendRoot "android\app\build\outputs\apk\release\app-release.apk"
  if (-not (Test-Path -LiteralPath $apk)) {
    throw "APK was not created at $apk"
  }

  Ensure-Directory (Split-Path -Parent $OutputApk)
  Copy-Item -LiteralPath $apk -Destination $OutputApk -Force

  Write-Step "Verifying APK signature"
  & "$AndroidSdkRoot\build-tools\36.0.0\apksigner.bat" verify --print-certs $OutputApk

  Write-Host ""
  Write-Host "APK release created:" -ForegroundColor Green
  Write-Host $OutputApk
}
finally {
  Pop-Location
}
