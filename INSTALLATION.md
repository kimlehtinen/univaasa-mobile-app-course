# Installation

This is a guide for installing and running Mood2Day.

## Requirements
- Node.js https://nodejs.org/en/
- React Native CLI https://www.npmjs.com/package/react-native-cli
- Android Studio https://developer.android.com/studio/
- Java Development Kit (JDK) If testing/developing Android

## Windows Development Environment
I recommend this guide for setting up Windows Development Environment https://codeburst.io/setting-up-development-environment-using-react-native-on-windows-dd240e69f776

## Installation

```
# clone the repository
https://github.com/kim3z/univaasa-mobile-app-course.git

# cd into source
cd univaasa-mobile-app-course

# install dependencies
npm install
```

## Run on Android emulator

```
# run on android emulator (requires Android Studio, Android emulator and JDK)
react-native run-android
```

Sometimes running on emulator stops working. If this happens, stop the `react-native run-android` process, and do this:
```
# go to android directory
cd android

# gradlew clean
./gradlew clean

# if previous command didn't work
# try changing ./gradlew --> gradlew

# go back to project root directory
cd ..

# run again on android emulator
react-native run-android
```

## Build debug apk
```
# go to android directory
cd android

# build debug apk
./gradlew assembleRelease

# if previous command didn't work
# try changing ./gradlew --> gradlew
```

Now you should find the apk here:
```
android/app/build/outputs/apk/debug/app-debug.apk
```