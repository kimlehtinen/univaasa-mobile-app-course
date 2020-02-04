import React, { Component } from 'react'
import { H2 } from 'native-base'
import NewMoodField from './NewMoodField'

export default class NewMoodSubject extends Component {
    updateValue(field, value) {
        this.props.updateValue(field, value);
    }

    render() {
        const subject = this.props.subject
        return (
            <>
            <H2>{subject.text}</H2>
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