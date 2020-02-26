import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Form, Spinner, Button, Text } from 'native-base'
import moodFieldsJson from './assets/moodFields.json'
import NewMoodSubject from './components/NewMoodSubject'
import firebase from 'react-native-firebase'

export default class EditMoodPage extends Component {

    constructor(props) {
        super(props)

        this.state = { 
            fields: null,
            mood: {},
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
        const mood = this.state.mood;
        mood[field] = value
        this.setState({mood})
    }

    componentDidMount() {
        const { currentUser } = firebase.auth()
        const fields = JSON.parse(JSON.stringify(moodFieldsJson))
        const mood = this.state.mood

        this.initmood(fields) // initialize new mood state object

        mood['user'] = currentUser.uid // add current user as owner for this new mood
        this.setState({ fields, mood, currentUser })
    }

    /**
     * Store new mood to firestore and delete any duplicates for same date
     */
    async addmood() {
        let moodId = null
        const { mood } = this.state

        // store new mood
        await firebase.firestore().collection("moods").add(mood).then((docRef) => {
            moodId = docRef.id
        }).catch(function(error) {
            console.log('ERROR:', error)
        });

        if (moodId) {
            // delete duplicates
            let duplicatesQuery = firebase.firestore().collection("moods").where("user", "==", this.state.currentUser.uid)
            await duplicatesQuery.get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        if (doc.data() && doc.id !== moodId && new Date(doc.data().date.toDate()).toDateString() == new Date(mood.date).toDateString()) {
                            doc.ref.delete();
                        }
                    });
            }).catch(function(error) {
                console.log('ERROR:', error)
            });
        }
    }

    /**
     * Initialize this.state.mood with properties (form fields) from ../assets/moodFields.json
     * @param {*} fields 
     */
    initmood(fields) {
        const mood = this.state.mood
        Object.keys(fields).map((subjectKey) => {
            const subject = fields[subjectKey]
            Object.keys(subject.fields).map((fieldKey) => {
                mood[fieldKey] = subject.fields[fieldKey].value
            })
        })
        this.setState({mood})
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
                onPress={() => this.addmood()} 
                full success rounded
                >
                <Text>Save</Text>
                </Button>
            </Form>
        )
    }
}

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
