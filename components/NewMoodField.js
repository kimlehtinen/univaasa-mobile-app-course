import React, { Component } from 'react'
import { 
    ListItem, 
    Text, 
    Radio, 
    Right, 
    Left,
    Textarea,
    Item,
    Label
} from 'native-base'

export default class NewMoodField extends Component {

    state = {
        value: null
    }

    componentDidMount() {
        this.setState({ value: this.props.field.value })
    }

    renderField(field) {
        if (field.type === 'radio') {
            return (
                <ListItem>
                <Left>
                    <Text onPress={() => this.onRadioPress()}>{field.text}</Text>
                </Left>
                <Right>
                    <Radio selected={this.state.value} onPress={() => this.onRadioPress()} />
                </Right>
                </ListItem>
            )
        }
        if (field.type === 'textarea') {
            return (
                <Item stackedLabel>
                <Label>
                    <Text>{field.text}</Text>
                </Label>
                <Textarea 
                style={{width: '100%'}} 
                rowSpan={5} 
                bordered 
                value={this.state.value}
                onChangeText={(evt) => this.updateTextInput(evt)}
                />
                </Item>
            )
        }
    }

    onRadioPress() {
        const newValue = !this.state.value
        this.setState({value: newValue})
        this.props.updateValue(this.props.fieldName, newValue)
    }

    updateTextInput(text) {
        const val = text
        this.setState({value: val})
        this.props.updateValue(this.props.fieldName, val)
    }

    render() {
        return (
            <>{this.props.field && this.renderField(this.props.field)}</>
        );
    }
}