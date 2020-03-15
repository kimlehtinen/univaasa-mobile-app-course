import React from 'react'
import { View, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import { Spinner } from 'native-base'

export default class LoginLoadingPage extends React.Component {
    /*
    Loading page that is shown while logging in
    */

    componentDidMount() {
        // go to dashboard page (Home) if already logged in
        // if not logged in, got to LoginPage
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