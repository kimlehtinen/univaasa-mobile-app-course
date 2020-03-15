import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Form, Toast, Spinner, Button, Text } from 'native-base'
import moodFieldsJson from '../assets/moodFields.json'
import NewMoodSubject from './NewMoodSubject'
import firebase from 'react-native-firebase'
import { withNavigation } from 'react-navigation'

class NewMood extends Component {

    /*
    Form for creating a new Mood
    */

    constructor(props) {
        super(props)

        this.state = { 
            fields: null,
            newMood: {},
            isLoading: false
        }
    }

    /**
     * Update value for a form field
     * 
     * @param {string} field 
     * @param {any} value 
     */
    updateValue(field, value) {
        const newMood = this.state.newMood;
        newMood[field] = value
        this.setState({newMood})
    }

    componentDidMount() {
        const { currentUser } = firebase.auth()
        const fields = JSON.parse(JSON.stringify(moodFieldsJson))
        const newMood = this.state.newMood

        this.initNewMood(fields) // initialize new mood state object

        newMood['user'] = currentUser.uid // add current user as owner for this new mood
        this.setState({ fields, newMood, currentUser })
    }

    /**
     * Store new mood to firestore and delete any duplicates for same date
     */
    async addNewMood() {
        let newMoodId = null
        let isAdded = false
        const { newMood } = this.state

        // store new mood
        await firebase.firestore().collection("moods").add(newMood).then((docRef) => {
            newMoodId = docRef.id
            isAdded = true
        }).catch(function(error) {
            console.log('ERROR:', error)
        });

        if (newMoodId) {
            // delete duplicates
            let duplicatesQuery = firebase.firestore().collection("moods").where("user", "==", this.state.currentUser.uid)
            await duplicatesQuery.get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        if (doc.data() && doc.id !== newMoodId && new Date(doc.data().date.toDate()).toDateString() == new Date(newMood.date).toDateString()) {
                            doc.ref.delete();
                        }
                    });
            }).catch(function(error) {
                console.log('ERROR:', error)
            });
        }

        if (isAdded) {
            this.props.setActiveTab('moods')
        }
    }

    /**
     * Initialize this.state.newMood with properties (form fields) from ../assets/moodFields.json
     * @param {*} fields 
     */
    initNewMood(fields) {
        const newMood = this.state.newMood
        Object.keys(fields).map((subjectKey) => {
            const subject = fields[subjectKey]
            Object.keys(subject.fields).map((fieldKey) => {
                newMood[fieldKey] = subject.fields[fieldKey].value
            })
        })
        this.setState({newMood})
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
            <Form>
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
                onPress={() => this.addNewMood()} 
                full success rounded
                >
                    <Text>Submit</Text>
                </Button>
            </Form>
        )
    }
}

export default withNavigation(NewMood)

const styles = StyleSheet.create({
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
