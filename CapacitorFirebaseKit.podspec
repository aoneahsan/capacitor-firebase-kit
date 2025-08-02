require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'CapacitorFirebaseKit'
  s.version = package['version']
  s.summary = package['description']
  s.license = package['license']
  s.homepage = package['repository']['url']
  s.author = package['author']
  s.source = { :git => package['repository']['url'], :tag => s.version.to_s }
  s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
  s.ios.deployment_target  = '14.0'
  s.dependency 'Capacitor'
  s.swift_version = '5.9'
  
  # Firebase dependencies
  s.dependency 'Firebase/Core'
  s.dependency 'Firebase/AppCheck'
  s.dependency 'Firebase/Analytics'
  s.dependency 'Firebase/Crashlytics'
  s.dependency 'Firebase/Performance'
  s.dependency 'Firebase/RemoteConfig'
  
  # Google Mobile Ads
  s.dependency 'Google-Mobile-Ads-SDK'
  s.dependency 'GoogleUserMessagingPlatform'
  
  # Static frameworks
  s.static_framework = true
  
  # Pods directory
  s.pod_target_xcconfig = {
    'SWIFT_OPTIMIZATION_LEVEL' => '-Owholemodule',
    'DEFINES_MODULE' => 'YES'
  }
end