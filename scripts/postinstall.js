#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📱 Capacitor Firebase Kit - Post Install Setup');

// Helper function to check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (e) {
    return false;
  }
}

// Helper function to read file
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

// Helper function to write file
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (e) {
    console.error(`Failed to write ${filePath}:`, e.message);
    return false;
  }
}

// Check if we're in a Capacitor project
const capacitorConfigPath = path.join(process.cwd(), 'capacitor.config.json');
if (!fileExists(capacitorConfigPath)) {
  console.log('ℹ️  Not in a Capacitor project root. Skipping auto-configuration.');
  process.exit(0);
}

console.log('✅ Detected Capacitor project');

// Android Setup
function setupAndroid() {
  console.log('\n🤖 Checking Android setup...');
  
  const androidPath = path.join(process.cwd(), 'android');
  if (!fileExists(androidPath)) {
    console.log('ℹ️  Android platform not added yet. Run: npx cap add android');
    return;
  }

  // Check project-level build.gradle
  const projectBuildGradlePath = path.join(androidPath, 'build.gradle');
  if (fileExists(projectBuildGradlePath)) {
    let projectBuildGradle = readFile(projectBuildGradlePath);
    
    if (projectBuildGradle && !projectBuildGradle.includes('com.google.gms:google-services')) {
      console.log('⚠️  Google Services plugin not found in android/build.gradle');
      console.log('📝 Add this to your android/build.gradle buildscript dependencies:');
      console.log(`
    dependencies {
        // ... existing dependencies ...
        classpath 'com.google.gms:google-services:4.4.0'
    }
`);
    } else {
      console.log('✅ Google Services plugin already configured');
    }
  }

  // Check app-level build.gradle
  const appBuildGradlePath = path.join(androidPath, 'app', 'build.gradle');
  if (fileExists(appBuildGradlePath)) {
    let appBuildGradle = readFile(appBuildGradlePath);
    
    if (appBuildGradle && !appBuildGradle.includes("apply plugin: 'com.google.gms.google-services'")) {
      console.log('⚠️  Google Services plugin not applied in android/app/build.gradle');
      console.log('📝 Add this line at the top of your android/app/build.gradle:');
      console.log(`
apply plugin: 'com.google.gms.google-services'
`);
    } else {
      console.log('✅ Google Services plugin already applied');
    }
  }

  // Check for google-services.json
  const googleServicesPath = path.join(androidPath, 'app', 'google-services.json');
  if (!fileExists(googleServicesPath)) {
    console.log('⚠️  google-services.json not found at android/app/google-services.json');
    console.log('📝 Download it from Firebase Console and place it in android/app/');
  } else {
    console.log('✅ google-services.json found');
  }
}

// iOS Setup
function setupIOS() {
  console.log('\n🍎 Checking iOS setup...');
  
  const iosPath = path.join(process.cwd(), 'ios');
  if (!fileExists(iosPath)) {
    console.log('ℹ️  iOS platform not added yet. Run: npx cap add ios');
    return;
  }

  // Check for GoogleService-Info.plist
  const googleServicePaths = [
    path.join(iosPath, 'App', 'App', 'GoogleService-Info.plist'),
    path.join(iosPath, 'App', 'GoogleService-Info.plist')
  ];
  
  const plistExists = googleServicePaths.some(p => fileExists(p));
  if (!plistExists) {
    console.log('⚠️  GoogleService-Info.plist not found');
    console.log('📝 Download it from Firebase Console and add it to your Xcode project');
  } else {
    console.log('✅ GoogleService-Info.plist found');
  }

  // Check AppDelegate for Firebase initialization
  const appDelegatePath = path.join(iosPath, 'App', 'App', 'AppDelegate.swift');
  if (fileExists(appDelegatePath)) {
    const appDelegate = readFile(appDelegatePath);
    
    if (appDelegate && !appDelegate.includes('import Firebase')) {
      console.log('⚠️  Firebase not imported in AppDelegate.swift');
      console.log('📝 Add "import Firebase" at the top of AppDelegate.swift');
    }
    
    if (appDelegate && !appDelegate.includes('FirebaseApp.configure()')) {
      console.log('⚠️  Firebase not initialized in AppDelegate.swift');
      console.log('📝 Add "FirebaseApp.configure()" in application:didFinishLaunchingWithOptions:');
    }
    
    if (appDelegate && appDelegate.includes('FirebaseApp.configure()')) {
      console.log('✅ Firebase initialization found in AppDelegate');
    }
  }
}

// Run setup checks
setupAndroid();
setupIOS();

console.log('\n📚 For detailed setup instructions, see:');
console.log('   https://github.com/aoneahsan/capacitor-firebase-kit#setup');
console.log('\n✨ Happy coding with Capacitor Firebase Kit!');