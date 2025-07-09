#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Capacitor Firebase Kit - Configuration Helper');

// Helper functions
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (e) {
    return false;
  }
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (e) {
    console.error(`Failed to write ${filePath}:`, e.message);
    return false;
  }
}

function backupFile(filePath) {
  if (fileExists(filePath)) {
    const backupPath = `${filePath}.backup.${Date.now()}`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`📋 Backed up ${path.basename(filePath)} to ${path.basename(backupPath)}`);
  }
}

// Auto-configure Android
function configureAndroid() {
  console.log('\n🤖 Configuring Android...');
  
  const androidPath = path.join(process.cwd(), 'android');
  if (!fileExists(androidPath)) {
    console.log('❌ Android platform not found. Run: npx cap add android');
    return false;
  }

  // Configure project-level build.gradle
  const projectBuildGradlePath = path.join(androidPath, 'build.gradle');
  if (fileExists(projectBuildGradlePath)) {
    let projectBuildGradle = readFile(projectBuildGradlePath);
    let modified = false;
    
    // Add Google Services classpath
    if (projectBuildGradle && !projectBuildGradle.includes('com.google.gms:google-services')) {
      backupFile(projectBuildGradlePath);
      
      // Find the dependencies block in buildscript
      const buildscriptRegex = /buildscript\s*{[\s\S]*?dependencies\s*{([\s\S]*?)}/;
      const match = projectBuildGradle.match(buildscriptRegex);
      
      if (match) {
        const dependencies = match[1];
        const updatedDependencies = dependencies + "\n        classpath 'com.google.gms:google-services:4.4.0'";
        projectBuildGradle = projectBuildGradle.replace(
          match[0],
          match[0].replace(dependencies, updatedDependencies)
        );
        modified = true;
      }
    }

    // Add additional Firebase classpaths
    const firebasePlugins = [
      "classpath 'com.google.firebase:firebase-crashlytics-gradle:2.9.9'",
      "classpath 'com.google.firebase:perf-plugin:1.4.2'"
    ];

    firebasePlugins.forEach(plugin => {
      if (!projectBuildGradle.includes(plugin.split("'")[1])) {
        const buildscriptRegex = /buildscript\s*{[\s\S]*?dependencies\s*{([\s\S]*?)}/;
        const match = projectBuildGradle.match(buildscriptRegex);
        
        if (match) {
          const dependencies = match[1];
          const updatedDependencies = dependencies + `\n        ${plugin}`;
          projectBuildGradle = projectBuildGradle.replace(
            match[0],
            match[0].replace(dependencies, updatedDependencies)
          );
          modified = true;
        }
      }
    });

    if (modified) {
      writeFile(projectBuildGradlePath, projectBuildGradle);
      console.log('✅ Updated android/build.gradle');
    } else {
      console.log('✅ android/build.gradle already configured');
    }
  }

  // Configure app-level build.gradle
  const appBuildGradlePath = path.join(androidPath, 'app', 'build.gradle');
  if (fileExists(appBuildGradlePath)) {
    let appBuildGradle = readFile(appBuildGradlePath);
    let modified = false;
    
    const plugins = [
      "apply plugin: 'com.google.gms.google-services'",
      "apply plugin: 'com.google.firebase.crashlytics'",
      "apply plugin: 'com.google.firebase.firebase-perf'"
    ];

    plugins.forEach(plugin => {
      if (appBuildGradle && !appBuildGradle.includes(plugin)) {
        // Add after the android plugin
        const androidPluginRegex = /apply plugin: ['"]com\.android\.application['"]/;
        if (androidPluginRegex.test(appBuildGradle)) {
          appBuildGradle = appBuildGradle.replace(
            androidPluginRegex,
            `$&\n${plugin}`
          );
          modified = true;
        }
      }
    });

    if (modified) {
      backupFile(appBuildGradlePath);
      writeFile(appBuildGradlePath, appBuildGradle);
      console.log('✅ Updated android/app/build.gradle');
    } else {
      console.log('✅ android/app/build.gradle already configured');
    }
  }

  // Check for google-services.json
  const googleServicesPath = path.join(androidPath, 'app', 'google-services.json');
  if (!fileExists(googleServicesPath)) {
    console.log('⚠️  google-services.json not found');
    console.log('   Download from: https://console.firebase.google.com');
    console.log('   Place at: android/app/google-services.json');
    return false;
  }

  return true;
}

// Auto-configure iOS
function configureIOS() {
  console.log('\n🍎 Configuring iOS...');
  
  const iosPath = path.join(process.cwd(), 'ios');
  if (!fileExists(iosPath)) {
    console.log('❌ iOS platform not found. Run: npx cap add ios');
    return false;
  }

  // Update AppDelegate.swift
  const appDelegatePath = path.join(iosPath, 'App', 'App', 'AppDelegate.swift');
  if (fileExists(appDelegatePath)) {
    let appDelegate = readFile(appDelegatePath);
    let modified = false;
    
    // Add Firebase import
    if (appDelegate && !appDelegate.includes('import Firebase')) {
      backupFile(appDelegatePath);
      
      // Add import after UIKit import
      appDelegate = appDelegate.replace(
        /import UIKit/,
        'import UIKit\nimport Firebase'
      );
      modified = true;
    }
    
    // Add Firebase configuration
    if (appDelegate && !appDelegate.includes('FirebaseApp.configure()')) {
      // Find the didFinishLaunchingWithOptions method
      const methodRegex = /func application\([^)]*\) -> Bool\s*{/;
      if (methodRegex.test(appDelegate)) {
        appDelegate = appDelegate.replace(
          methodRegex,
          '$&\n        FirebaseApp.configure()'
        );
        modified = true;
      }
    }
    
    if (modified) {
      writeFile(appDelegatePath, appDelegate);
      console.log('✅ Updated AppDelegate.swift');
    } else {
      console.log('✅ AppDelegate.swift already configured');
    }
  }

  // Check for GoogleService-Info.plist
  const googleServicePaths = [
    path.join(iosPath, 'App', 'App', 'GoogleService-Info.plist'),
    path.join(iosPath, 'App', 'GoogleService-Info.plist')
  ];
  
  const plistExists = googleServicePaths.some(p => fileExists(p));
  if (!plistExists) {
    console.log('⚠️  GoogleService-Info.plist not found');
    console.log('   Download from: https://console.firebase.google.com');
    console.log('   Add to Xcode project (drag into project navigator)');
    return false;
  }

  // Update Podfile if needed
  const podfilePath = path.join(iosPath, 'App', 'Podfile');
  if (fileExists(podfilePath)) {
    let podfile = readFile(podfilePath);
    let modified = false;
    
    // Ensure use_frameworks! is present
    if (podfile && !podfile.includes('use_frameworks!')) {
      podfile = podfile.replace(
        /platform :ios[^\n]*/,
        '$&\nuse_frameworks!'
      );
      modified = true;
    }
    
    if (modified) {
      backupFile(podfilePath);
      writeFile(podfilePath, podfile);
      console.log('✅ Updated Podfile');
      console.log('   Run: cd ios/App && pod install');
    }
  }

  return true;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const platform = args[0];
  
  if (!platform || (platform !== 'android' && platform !== 'ios' && platform !== 'all')) {
    console.log('Usage: node configure-firebase.js <platform>');
    console.log('  platform: android, ios, or all');
    process.exit(1);
  }

  let success = true;

  if (platform === 'android' || platform === 'all') {
    success = configureAndroid() && success;
  }
  
  if (platform === 'ios' || platform === 'all') {
    success = configureIOS() && success;
  }

  if (success) {
    console.log('\n✅ Configuration complete!');
    console.log('   Run: npx cap sync');
  } else {
    console.log('\n⚠️  Configuration incomplete. Please complete manual steps above.');
  }
}

main().catch(console.error);