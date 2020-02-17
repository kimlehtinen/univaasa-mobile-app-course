import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Form, Toast, Spinner, Button, Text } from 'native-base'
import moodFieldsJson from '../assets/moodFields.json'
import NewMoodSubject from './NewMoodSubject'
import firebase from 'react-native-firebase'

export default class NewMood extends Component {

    constructor(props) {
        super(props)

        this.state = { 
            fields: null,
            newMood: {},
            isLoading: false
        }
    }

    updateValue(field, value) {
        const newMood = this.state.newMood;
        newMood[field] = value
        this.setState({newMood})
        console.log('NEWMOOD:', newMood)
    }

    componentDidMount() {
        const { currentUser } = firebase.auth()
        const fields = JSON.parse(JSON.stringify(moodFieldsJson))
        const newMood = this.state.newMood

        this.initNewMood(fields)

        newMood['user'] = currentUser.uid
        this.setState({ fields, newMood, currentUser })
    }

    async addNewMood() {
        let newMoodId = null
        const { newMood } = this.state
        await firebase.firestore().collection("moods").add(newMood).then((docRef) => {
            newMoodId = docRef.id
        }).catch(function(error) {
            console.log('ERROR:', error)
        });

        if (newMoodId) {
            let duplicatesQuery = firebase.firestore().collection("moods").where("user", "==", this.state.currentUser.uid)
            await duplicatesQuery.get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        if (doc.data() && doc.id !== newMoodId && new Date(doc.data().date.toDate()).toDateString() == new Date(newMood.date).toDateString()) {
                            doc.ref.delete();
                        }
                    });
            }).catch(function(error) {
                console.log('ERROR HERE:', error)
            });
        }
    }

    initNewMood(fields) {
        const newMood = this.state.newMood
        Object.keys(fields).map((subjectKey) => {
            const subject = fields[subjectKey]
            Object.keys(subject.fields).map((fieldKey) => {
                newMood[fieldKey] = subject.fields[fieldKey].value
            })
        })

        console.log('INIT:', newMood)
        this.setState({newMood})
    }

    render() {
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
