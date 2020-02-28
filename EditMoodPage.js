import React, { Component } from 'react'
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native'
import { Form, Spinner, Button, Text, Icon } from 'native-base'
import moodFieldsJson from './assets/moodFields.json'
import NewMoodSubject from './components/NewMoodSubject'
import firebase from 'react-native-firebase'

export default class EditMoodPage extends Component {

    constructor(props) {
        super(props)

        this.state = { 
            fields: null,
            editedMood: {},
            oldMood: {},
            isLoading: false,
            editedMoodId: null
        }
    }

    /**
     * Update value for a form field
     * 
     * @param {string} field 
     * @param {any} value 
     */
    updateValue(field, value) {
        const editedMood = this.state.editedMood;
        editedMood[field] = value
        this.setState({editedMood})
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('willFocus', () => {
            const { currentUser } = firebase.auth()
            const fields = JSON.parse(JSON.stringify(moodFieldsJson))
            const editedMood = this.props.navigation.state.params.editedMood
            const oldMood = editedMood
            const editedMoodId = editedMood.id
            delete editedMood['id']

            for (const subject in fields) {
                if (fields[subject].fields) {
                    Object.keys(fields[subject].fields).map((field) => {
                        fields[subject].fields[field].value = editedMood[field];
                    })
                }
            }

            editedMood['user'] = currentUser.uid // add current user as owner for this new editedMood
            this.setState({ fields, editedMood, currentUser, editedMoodId, oldMood })
        });
    }
  
    componentWillUnmount() {
        this._unsubscribe();
    }

    /**
     * Update mood in firestore
     */
    async updateMood() {
        await firebase.firestore().collection("moods").doc(this.state.editedMoodId).update(this.state.editedMood).then(() => {
            this.props.navigation.navigate('Home') // show all moods
        }).catch(function(error) {
            console.log('ERROR:', error)
        });
    }

    render() {
        // show spinner whenever app is in a loading state
        if (this.state.isLoading) {
            return (
                <View style={styles.spinnerContainer}>
                    <Spinner color='blue' />
                </View>
            )
        }

        return (
            <ScrollView style={styles.container}>
                <View style={{flex:1}}>
                    <Form style={styles.form}>
                        <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => this.props.navigation.navigate('SingleMoodPage', {singleMood: this.state.oldMood})} 
                        >
                            <Text><Icon type="FontAwesome5" name="chevron-left" /> Back</Text>
                        </TouchableOpacity>
                        { this.state.fields &&
                        Object.keys(this.state.fields).map((subjectKey) => {
                            return (
                                <NewMoodSubject 
                                key={subjectKey}
                                subject={this.state.fields[subjectKey]} 
                                updateValue={this.updateValue.bind(this)} 
                                />
                            )
                        })}

                        <Button
                        style={styles.submitButton}
                        onPress={() => this.updateMood()} 
                        full success rounded
                        >
                        <Text>Update</Text>
                        </Button>
                    </Form>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        margin: 20
    },
    backButton: {
        marginBottom: 20
    },
    submitButton: {
        marginTop: 40,
        marginBottom: 40,
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})