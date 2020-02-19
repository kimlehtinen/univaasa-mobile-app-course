import React from 'react'
import { StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import { AppRegistry, Image, StatusBar } from 'react-native'
import {
  Button,
  Text,
  Container,
  List,
  ListItem,
  Content,
  Icon
} from "native-base";

export default class SideBar extends React.Component {
    /**
     * Logs out signed in user
     */
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
            <Content style={styles.sidebarContent}>
                <Button
                style={styles.closeSidebarButton}
                end
                rounded
                dark
                onPress={() => this.props.navigation.closeDrawer()}
                >
                <Text>X</Text>
                </Button>
                <List>
                    <ListItem
                    button
                    onPress={() => this.props.navigation.navigate('Home')}
                    >
                    <Text>Home</Text>
                    </ListItem>
                    <ListItem
                    button
                    onPress={this.logOut}
                    >
                    <Text>Logout</Text>
                    </ListItem>
                </List>
            </Content>
        </Container>
        );
    }
}

const styles = StyleSheet.create({
    sidebarContent: {
        flexDirection: 'column', 
        flex: 1
    },
    closeSidebarButton: {
        alignSelf: 'flex-end',
        position: 'absolute',
        zIndex: 1000,
        top: 5,
        right: 5
    }
})
