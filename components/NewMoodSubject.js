import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { H2 } from 'native-base'
import NewMoodField from './NewMoodField'

export default class NewMoodSubject extends Component {
    /*
        NewMoodSubject component is a child component inside NewMood component (form).
        Each subject inside form, is a new subject with fields related to this subject.
        Each NewMoodSubject have NewMoodField child components, which are the actual form fields that the users fill in.
        A form field value is passed from NewMoodField.js (Child) --> NewMoodSubject.js (Current) --> NewMood.js (Parent).
        Form subjects and fields come from ../assets/moodFields.json.
    */

    /**
     * Pass subject child field value to parent component NewMood
     *
     * @param {string} field 
     * @param {any} value 
     */
    updateValue(field, value) {
        this.props.updateValue(field, value);
    }

    render() {
        const subject = this.props.subject
        return (
            <>
            <H2 style={styles.subjectHeading}>{subject.text}</H2>
            {
                Object.keys(subject.fields).map((fieldKey) => {
                    return (
                        <NewMoodField 
                            key={fieldKey} 
                            fieldName={fieldKey} 
                            field={subject.fields[fieldKey]} 
                            updateValue={this.updateValue.bind(this)}
                        />
                    )
                })
            }
            </>
        );
    }
}

const styles = StyleSheet.create({
    subjectHeading: {
        marginTop: 20
    }
})
