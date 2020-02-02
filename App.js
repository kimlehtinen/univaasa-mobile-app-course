import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import LoginLoadingPage from './LoginLoadingPage'
import RegisterPage from './RegisterPage'
import LoginPage from './LoginPage'
import HomePage from './HomePage'
import { createDrawerNavigator } from 'react-navigation-drawer'
import SideBar from "./components/Sidebar";


const App = createDrawerNavigator(
  {
    LoginLoadingPage: { screen: LoginLoadingPage },
    LoginPage: { screen: LoginPage },
    RegisterPage: { screen: RegisterPage },
    Home: { screen: HomePage },
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);

export default createAppContainer(App);
