import React from 'react'
import { StyleSheet, View, ImageBackground } from 'react-native'
import firebase from 'react-native-firebase'
import { 
    Container, 
    Header, 
    Body,
    Content, 
    Form, 
    Item, 
    Input, 
    Button, 
    Text,
    Title,
    Label,
    H1
} from 'native-base'

export default class RegisterPage extends React.Component {
    /*
    Application register page.
    User can sign up using firebase, email and password.
    */

    state = { 
        email: '', 
        password: '', 
        authError: null 
    }
    
    /**
     * Register new user to firebase
     */
    registerNewUser = () => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(() => this.props.navigation.navigate('Home'))
          .catch(error => this.setState({ authError: error.message }))
    }

    render() {
        return (
            <Container>
                <ImageBackground source={require('./assets/clouds.jpg')} style={styles.bg}>
                    <View style={styles.opacityBg}>
                        <Header style={styles.registerHeader}>
                            <Body style={styles.registerTitle}>
                                <Title>Easy Weather App</Title>
                            </Body>
                        </Header>
                        <Content padder>
                            <View style={styles.registerSubtitle}>
                                <H1 style={styles.textWhite}>Register</H1>
                            </View>
                            {   
                                this.state.authError &&
                                <Text style={{ color: 'red' }}>
                                    {this.state.authError}
                                </Text>
                            }
                            <Form>
                                <Item floatingLabel>
                                    <Label style={styles.textWhite}>Email</Label>
                                    <Input 
                                    style={styles.textWhite}
                                    autoCapitalize="none"
                                    onChangeText={email => this.setState({ email })}
                                    value={this.state.email}
                                    />
                                </Item>
                                <Item floatingLabel last>
                                    <Label style={styles.textWhite}>Password</Label>
                                    <Input 
                                    style={styles.textWhite}
                                    secureTextEntry
                                    placeholder="Password"
                                    autoCapitalize="none"
                                    onChangeText={password => this.setState({ password })}
                                    value={this.state.password}
                                    />
                                </Item>
                                <Button 
                                onPress={this.registerNewUser}
                                full primary rounded
                                style={styles.registerButton}
                                >
                                <Text>Register</Text>
                                </Button>
                                <Button
                                onPress={() => this.props.navigation.navigate('LoginPage')}
                                full light rounded
                                style={styles.loginButton}
                                >
                                <Text>Already have an accout? Login here</Text>
                                </Button>
                            </Form>
                        </Content>
                    </View>
                </ImageBackground>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    bg: {
        width: '100%',
        height: '100%',
    },
    opacityBg: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(52, 52, 52, 0.7)',
    },
    registerHeader: {
        backgroundColor: 'transparent'
    },
    textWhite: {
        color: 'white',
    },
    registerTitle: {
        alignItems: 'center',
        flex: 1,  
        justifyContent: 'center',
    },
    registerSubtitle: {
        alignItems: 'center',
        flex: 1,  
        justifyContent: 'center',
        marginTop: 20,
    },
    registerButton: {
        marginTop: 40,
    },
    loginButton: {
        marginTop: 10,
    }
})