import React, { Component } from 'react'
import { BackHandler, StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native'
import { Form, Spinner, Button, Text, Icon } from 'native-base'
import moodFieldsJson from './assets/moodFields.json'
import NewMoodSubject from './components/NewMoodSubject'
import firebase from 'react-native-firebase'

export default class EditMoodPage extends Component {

    /*
    Page with a form to edit a mood
    */

    constructor(props) {
        super(props)

        this.state = { 
            fields: null,
            editedMood: {},
            unEditedMood: {},
            isLoading: false,
            editedMoodId: null
        }

        this.hardwareBackButtonClick = this.hardwareBackButtonClick.bind(this);
    }

    /**
     * Update value for a form field when editing mood
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
        // get current user
        const { currentUser } = firebase.auth()
        // get mood fields to be shown in form
        const fields = JSON.parse(JSON.stringify(moodFieldsJson))
        // get mood from parent that should be edited with its current data
        const editedMood = this.props.editedMood
        const editedMoodId = editedMood.id
        delete editedMood['id']

        // replace each form field value with current mood data values
        for (const subject in fields) {
            if (fields[subject].fields) {
                Object.keys(fields[subject].fields).map((field) => {
                    fields[subject].fields[field].value = editedMood[field];
                })
            }
        }

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.hardwareBackButtonClick);
        this.setState({ fields, editedMood, currentUser, editedMoodId })
    }

    /**
     * Go back handler for hardware back button
     */
    hardwareBackButtonClick = () => {
        this.goBack();
        return true;
    }
    
    componentWillUnmount() {
        this.backHandler.remove()
    }

    /**
     * Update mood in firestore
     */
    async updateMood() {
        await firebase.firestore().collection("moods").doc(this.state.editedMoodId).update(this.state.editedMood).then(() => {
            this.goBack()
        }).catch(function(error) {
            console.log('ERROR:', error)
        });
    }

    /**
     * Go back to SingleMoodPage with unedited data from firestore
     * since user doesn't save changes in this form if they click back button.
     */
    async goBack() {
        await firebase.firestore().collection("moods").doc(this.state.editedMoodId).get().then((doc) => {
            const mood = doc.data()
            mood['id'] = doc.id
            this.props.openMood(mood)
        }).catch(function(error) {
            console.log('Error finding mood by document id:', error)
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
                        onPress={() => this.goBack()} 
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
