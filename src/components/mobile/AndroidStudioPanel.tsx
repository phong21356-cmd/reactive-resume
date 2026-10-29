import React, { useState, useMemo } from 'react';
import { zipSync, strToU8 } from 'fflate';
import { generateAndroidProjectFiles, AndroidBuildConfig } from '../../utils/androidProjectBuilder';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  Smartphone,
  Download,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  Package,
} from 'lucide-react';

interface AndroidStudioPanelProps {
  isPhonePreview: boolean;
  onTogglePhonePreview: () => void;
}

export const AndroidStudioPanel: React.FC<AndroidStudioPanelProps> = ({
  isPhonePreview,
  onTogglePhonePreview,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const [config, setConfig] = useState<AndroidBuildConfig>({
    appName: 'Reactive Resume',
    applicationId: 'me.rxresu.android',
    versionName: '6.0.0',
    versionCode: 60,
    webAppUrl:
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://rxresu.me',
    themeColorHex: '#0f172a',
    enableOfflineCache: true,
    enableBiometricLock: false,
  });

  const [selectedFile, setSelectedFile] = useState<string>('app/src/main/AndroidManifest.xml');
  const [copied, setCopied] = useState(false);
  const [downloadedNotice, setDownloadedNotice] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const generatedFiles = useMemo(() => generateAndroidProjectFiles(config), [config]);
  const fileKeys = Object.keys(generatedFiles);
  const activeCode = generatedFiles[selectedFile] || generatedFiles[fileKeys[0]];

  const handleDownloadZip = () => {
    const zipEntries: Record<string, Uint8Array> = {};
    for (const [path, content] of Object.entries(generatedFiles)) {
      zipEntries[`reactive-resume-android/${path}`] = strToU8(content);
    }
    const zipped = zipSync(zipEntries, { level: 6 });
    const blob = new Blob([zipped], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.applicationId}-android-studio-project.zip`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadedNotice(true);
    setTimeout(() => setDownloadedNotice(false), 3000);
  };

  const handleCopyCode = () => {
    void navigator.clipboard?.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card: Android App Build & Simulator Switch */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-100">
              Android App &amp; APK Build Studio
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Install directly on Android via WebAPK / PWA, preview in the interactive Pixel 9 Pro device frame, or export a native Kotlin + Android Studio project bundle (SDK 35).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onTogglePhonePreview}
              className="hidden lg:flex min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Smartphone className="h-4 w-4 text-blue-400" />
              {isPhonePreview ? 'Exit Android Device Frame' : 'Preview in Pixel 9 Frame'}
            </button>

            <button
              type="button"
              onClick={handleDownloadZip}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Package className="h-4 w-4" />
              {downloadedNotice ? 'Downloaded .zip Bundle!' : 'Download Android Studio (.zip)'}
            </button>
          </div>
        </div>

        {/* Direct Android PWA / WebAPK Install Row */}
        <div className="rounded-xl bg-slate-950 border border-slate-800/80 p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-100">
                Android WebAPK &amp; Offline Service Worker Active
              </div>
              <div className="text-xs text-slate-400">
                192px, 512px, and Maskable Android adaptive icons configured · Standalone display mode
              </div>
            </div>
          </div>

          {!isInstalled && (
            <button
              type="button"
              onClick={() => {
                if (isInstallable) {
                  void install();
                } else {
                  setShowInstallGuide((prev) => !prev);
                }
              }}
              className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" />
              Install on Android Device
            </button>
          )}
        </div>

        {showInstallGuide && (
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-slate-100">
              How to install directly on your Android phone or tablet:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Open this app URL in <strong className="text-slate-200">Google Chrome for Android</strong>.</li>
              <li>Tap the browser menu (<strong className="text-slate-200">⋮</strong>) and select <strong className="text-slate-200">Add to Home screen / Install app</strong>.</li>
              <li>Alternatively, download the <strong className="text-slate-200">Android Studio (.zip)</strong> project above and run <code className="font-mono text-blue-400">./gradlew assembleDebug</code> to build a standalone <code className="font-mono text-blue-400">app-debug.apk</code>.</li>
            </ol>
          </div>
        )}
      </div>

      {/* Android Project Configuration Form */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-100">
          Android Manifest &amp; Gradle Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="android-app-name" className="block text-xs font-medium text-slate-400 mb-1">
              Android Launcher Name
            </label>
            <input
              id="android-app-name"
              type="text"
              value={config.appName}
              onChange={(e) => setConfig({ ...config, appName: e.target.value })}
              className="w-full min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="android-pkg-id" className="block text-xs font-medium text-slate-400 mb-1">
              Application ID (Package Name)
            </label>
            <input
              id="android-pkg-id"
              type="text"
              value={config.applicationId}
              onChange={(e) => setConfig({ ...config, applicationId: e.target.value })}
              className="w-full min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="android-version-name" className="block text-xs font-medium text-slate-400 mb-1">
              Version Name
            </label>
            <input
              id="android-version-name"
              type="text"
              value={config.versionName}
              onChange={(e) => setConfig({ ...config, versionName: e.target.value })}
              className="w-full min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 font-mono tabular-nums focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="android-version-code" className="block text-xs font-medium text-slate-400 mb-1">
              Version Code (Play Store Integer)
            </label>
            <input
              id="android-version-code"
              type="number"
              value={config.versionCode}
              onChange={(e) => setConfig({ ...config, versionCode: Number(e.target.value) || 1 })}
              className="w-full min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 font-mono tabular-nums focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Live Source Code Inspector */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-2 bg-slate-950/50">
          <div className="flex items-center gap-1 overflow-x-auto">
            {fileKeys.map((fileKey) => {
              const shortLabel =
                fileKey === 'app/build.gradle.kts'
                  ? 'app/build.gradle.kts'
                  : fileKey.split('/').pop() || fileKey;
              return (
                <button
                  key={fileKey}
                  type="button"
                  onClick={() => setSelectedFile(fileKey)}
                  className={`min-h-[38px] px-3 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap shrink-0 ${
                    selectedFile === fileKey
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="min-h-[38px] px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy File'}
          </button>
        </div>

        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/60 text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-blue-400" />
          {selectedFile}
        </div>

        <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-80 bg-slate-950">
          <code>{activeCode}</code>
        </pre>
      </div>
    </div>
  );
};
