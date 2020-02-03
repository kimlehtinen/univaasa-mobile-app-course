import React from 'react'
import { StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import AppTabs from './components/AppTabs'
import {
  Button,
  Text,
  Container,
  Card,
  CardItem,
  Body,
  Content,
  Header,
  Title,
  Left,
  Icon,
  Right,
  Tab, 
  Tabs, 
  TabHeading
} from 'native-base'

export default class HomePage extends React.Component {
    state = { 
        user: null 
    }

    componentDidMount() {
        const { currentUser } = firebase.auth()
        this.setState({ currentUser })
        // this.getMoods(currentUser)
    }

    logOut = async () => {
        try {
            await firebase.auth().signOut()
            this.props.navigation.navigate('LoginPage')
        } catch (e) {
            console.log(e);
        }
    }

    render() {

        return (
            <Container>
            <Header>
              <Left>
                <Button
                  transparent
                  onPress={() => this.props.navigation.openDrawer()}
                >
                  <Icon name="menu" />
                </Button>
              </Left>
              <Body>
                <Title>Mood</Title>
              </Body>
              <Right />
            </Header>
            <AppTabs/>
          </Container>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flex: 1,
    justifyContent: 'center',
  }
})