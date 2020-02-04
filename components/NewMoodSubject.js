import React, { Component } from 'react'
import { H2 } from 'native-base'
import NewMoodField from './NewMoodField'

export default class NewMoodSubject extends Component {
    render() {
        const subject = this.props.subject
        return (
            <>
            <H2>{subject.text}</H2>
            {Object.keys(subject.fields).map((fieldKey) => <NewMoodField key={fieldKey} field={subject.fields[fieldKey]}/>)}
            </>
        );
    }
}