import React from 'react'
import { StyleSheet } from 'react-native'
import firebase from 'react-native-firebase'
import {
  Button,
  Text,
  Container,
  List,
  ListItem,
  Content,
  Icon,
  Left,
  Body
} from "native-base";

export default class SideBar extends React.Component {
    state = {
        currentUser: null
    }

    componentDidMount() {
        const { currentUser } = firebase.auth()
        this.setState({ currentUser })
    }

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
                    <ListItem icon style={styles.userEmail}>
                    <Left>
                        <Icon 
                        type="FontAwesome" 
                        name="user" 
                        />
                    </Left>
                    <Body>
                    {
                        this.state.currentUser && 
                        <Text>
                            {this.state.currentUser.email}
                        </Text>
                    }
                    </Body>
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
    userEmail: {
        marginTop: 40,
        marginBottom: 20
    },
    userIcon: {
        marginRight: 10
    },
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
