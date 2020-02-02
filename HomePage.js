import React from 'react'
import { StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
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
        this.setState({ user: currentUser })
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
        const { user } = this.state
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
                <Title>Current city</Title>
              </Body>
              <Right />
            </Header>
            <Tabs>
            <Tab heading={ <TabHeading><Text>Today</Text></TabHeading>}>
                <Text>Weather today</Text>
            </Tab>
            <Tab heading={ <TabHeading><Text>Week</Text></TabHeading>}>
                <Text>Weather this week</Text>
            </Tab>
            <Tab heading={ <TabHeading><Text>Tab 3</Text></TabHeading>}>
                <Text>Tab 3</Text>
            </Tab>
            </Tabs>
            <Content padder>
                <Text>justifyContent</Text>
            </Content>
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