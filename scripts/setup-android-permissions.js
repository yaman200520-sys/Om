#!/usr/bin/env node
/**
 * Automatically injects all mobile permissions (Storage, Camera, Mic, Alarms, Notifications)
 * into AndroidManifest.xml for Tauri v2 Android builds.
 */

import fs from 'fs';
import path from 'path';

const manifestPath = path.resolve(
  process.cwd(),
  'src-tauri/gen/android/app/src/main/AndroidManifest.xml'
);

const PERMISSIONS = [
  '<!-- Network access -->',
  '<uses-permission android:name="android.permission.INTERNET" />',
  '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />',
  '<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />',
  '',
  '<!-- Storage & Media permissions (Full File Storage access) -->',
  '<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />',
  '<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" tools:ignore="ScopedStorage" />',
  '<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" tools:ignore="ScopedStorage" />',
  '<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />',
  '<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />',
  '<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />',
  '',
  '<!-- Audio Recording (Voice Notes & Voice Commands) -->',
  '<uses-permission android:name="android.permission.RECORD_AUDIO" />',
  '<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />',
  '',
  '<!-- Camera (Document scanner & Photos) -->',
  '<uses-permission android:name="android.permission.CAMERA" />',
  '<uses-feature android:name="android.hardware.camera" android:required="false" />',
  '<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />',
  '',
  '<!-- Alarms, Reminders & Background Services -->',
  '<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />',
  '<uses-permission android:name="android.permission.WAKE_LOCK" />',
  '<uses-permission android:name="android.permission.VIBRATE" />',
  '<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />',
  '<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />',
  '<uses-permission android:name="android.permission.USE_EXACT_ALARM" />',
  '<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />',
  '<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />',
  '<uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />'
];

if (fs.existsSync(manifestPath)) {
  let content = fs.readFileSync(manifestPath, 'utf8');

  // Ensure xmlns:tools is in <manifest>
  if (!content.includes('xmlns:tools=')) {
    content = content.replace(
      '<manifest',
      '<manifest xmlns:tools="http://schemas.android.com/tools"'
    );
  }

 // Ensure requestLegacyExternalStorage is in <application>
if (!content.includes('android:requestLegacyExternalStorage=')) {
  content = content.replace(
    '<application',
    `<application
        android:requestLegacyExternalStorage="true"`
  );
}

  // Inject permissions if not already present
  for (const perm of PERMISSIONS) {
    if (perm && !perm.startsWith('<!--') && !content.includes(perm)) {
      content = content.replace(
        /<application/i,
        `    ${perm}\n\n    <application`
      );
    }
  }

  fs.writeFileSync(manifestPath, content, 'utf8');
  console.log('✓ Successfully verified and injected all Android permissions into AndroidManifest.xml');
} else {
  console.log(`ℹ AndroidManifest.xml not found yet at ${manifestPath}. It will be populated when Tauri Android initializes.`);
}
