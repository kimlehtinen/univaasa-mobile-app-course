import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import LoginLoadingPage from './LoginLoadingPage'
import RegisterPage from './RegisterPage'
import LoginPage from './LoginPage'
import HomePage from './HomePage'

export default createAppContainer(createSwitchNavigator(
{
LoginLoadingPage,
RegisterPage,
LoginPage,
HomePage
},
{
initialRouteName: 'LoginLoadingPage'
}
));