export interface AndroidBuildConfig {
  appName: string;
  applicationId: string;
  versionName: string;
  versionCode: number;
  webAppUrl: string;
  themeColorHex: string;
  enableOfflineCache: boolean;
  enableBiometricLock: boolean;
}

export function generateAndroidProjectFiles(config: AndroidBuildConfig): Record<string, string> {
  const pkgPath = config.applicationId.replace(/\./g, '/');

  const settingsGradle = `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "${config.appName.replace(/[^a-zA-Z0-9]/g, '')}"
include(":app")
`;

  const rootBuildGradle = `plugins {
    id("com.android.application") version "8.7.2" apply false
    id("org.jetbrains.kotlin.android") version "2.0.21" apply false
}
`;

  const appBuildGradle = `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "${config.applicationId}"
    compileSdk = 35

    defaultConfig {
        applicationId = "${config.applicationId}"
        minSdk = 26
        targetSdk = 35
        versionCode = ${config.versionCode}
        versionName = "${config.versionName}"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.activity:activity-ktx:1.9.3")
    implementation("androidx.webkit:webkit:1.12.1")
    implementation("com.google.androidbrowserhelper:androidbrowserhelper:2.5.0")
}
`;

  const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:label="${config.appName}"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.DeviceDefault.NoActionBar">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="https" android:host="${new URL(config.webAppUrl).host}" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`;

  const mainActivityKt = `package ${config.applicationId}

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.print.PrintAttributes
import android.print.PrintManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.window.OnBackInvokedDispatcher

class MainActivity : Activity() {
    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        webView = WebView(this)
        setContentView(webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = false
            cacheMode = ${config.enableOfflineCache ? 'WebSettings.LOAD_DEFAULT' : 'WebSettings.LOAD_NO_CACHE'}
            setSupportZoom(false)
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                return false
            }
        }
        webView.webChromeClient = WebChromeClient()
        webView.loadUrl("${config.webAppUrl}")

        onBackInvokedDispatcher.registerOnBackInvokedCallback(
            OnBackInvokedDispatcher.PRIORITY_DEFAULT
        ) {
            if (webView.canGoBack()) {
                webView.goBack()
            } else {
                finish()
            }
        }
    }

    fun printResumePdf(jobName: String = "${config.appName} Document") {
        val printManager = getSystemService(PRINT_SERVICE) as PrintManager
        val printAdapter = webView.createPrintDocumentAdapter(jobName)
        printManager.print(
            jobName,
            printAdapter,
            PrintAttributes.Builder()
                .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                .build()
        )
    }
}
`;

  const capacitorConfig = JSON.stringify(
    {
      appId: config.applicationId,
      appName: config.appName,
      webDir: 'dist',
      server: {
        url: config.webAppUrl,
        cleartext: false,
      },
      android: {
        allowMixedContent: false,
        backgroundColor: config.themeColorHex,
      },
    },
    null,
    2
  );

  const assetLinks = JSON.stringify(
    [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: config.applicationId,
          sha256_cert_fingerprints: [
            'FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C',
          ],
        },
      },
    ],
    null,
    2
  );

  const readme = `# ${config.appName} — Android Studio Project

This bundle contains a ready-to-compile Android project wrapping **${config.appName}** (${config.webAppUrl}).

## Quick Start (Android Studio Ladybug / SDK 35)

1. Unzip \`reactive-resume-android-project.zip\` and open the folder in **Android Studio**.
2. Wait for Gradle Sync to finish.
3. Connect an Android device (USB debugging enabled) or launch a Pixel Emulator.
4. Click **Run 'app'** (or run \`./gradlew assembleDebug\` to output \`app/build/outputs/apk/debug/app-debug.apk\`).

## Instant WebAPK / PWA Installation on Android

You can also install the app directly on Android without compiling:
1. Open \`${config.webAppUrl}\` in Chrome on Android.
2. Tap **Install App** in the top app bar (or Chrome Menu → **Add to Home screen / Install app**).
`;

  return {
    'settings.gradle.kts': settingsGradle,
    'build.gradle.kts': rootBuildGradle,
    'app/build.gradle.kts': appBuildGradle,
    'app/src/main/AndroidManifest.xml': manifestXml,
    [`app/src/main/java/${pkgPath}/MainActivity.kt`]: mainActivityKt,
    'capacitor.config.json': capacitorConfig,
    'app/src/main/assets/assetlinks.json': assetLinks,
    'README-ANDROID.md': readme,
  };
}
