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

    renderField(field) {
        if (field.type === 'radio') {
            return (
                <ListItem>
                <Left>
                    <Text>{field.text}</Text>
                </Left>
                <Right>
                    <Radio selected={true} />
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
                <Textarea style={{width: '100%'}} rowSpan={5} bordered />
                </Item>
            )
        }
    }

    render() {
        return (
            <>{this.props.field && this.renderField(this.props.field)}</>
        );
    }
}