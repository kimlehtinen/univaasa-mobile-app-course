import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native'
import firebase from 'react-native-firebase'
import { Spinner } from 'native-base'

export default class LoginLoadingPage extends React.Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            let nextPage = user ? 'Home' : 'LoginPage'
            this.props.navigation.navigate(nextPage)
        })
    }
  
    render() {
        return (
            <View style={styles.container}>
                <Spinner color='blue' />
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})