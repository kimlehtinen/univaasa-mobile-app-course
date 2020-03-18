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
git clone https://github.com/kim3z/univaasa-mobile-app-course.git

# cd into source
cd univaasa-mobile-app-course

# install dependencies
npm install
```

## Run on Android (Device or emulator)
If you run on real device, you need to enable developer settings and usb debugging.

```
# run on android
npm run android
```

Sometimes running on android stops working. If this happens, stop the `npm run android` process, and do this:
```
# go to android directory
cd android

# gradlew clean
./gradlew clean

# if previous command didn't work
# try changing ./gradlew --> gradlew

# go back to project root directory
cd ..

# run again on android
npm run android
```
