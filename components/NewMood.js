import React, { Component } from 'react'
import { Form } from 'native-base'
import moodFieldsJson from '../assets/moodFields.json'
import NewMoodSubject from './NewMoodSubject'

export default class NewMood extends Component {

    state = { 
        fields: null,
        newMood: {}
    }

    updateValue(field, value) {
        const newMood = this.state.newMood;
        newMood[field] = value
        this.setState({newMood})
    }

    componentDidMount() {
        const fields = JSON.parse(JSON.stringify(moodFieldsJson))
        this.setState({ fields })
    }

    render() {
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
            </Form>
        )
    }
}