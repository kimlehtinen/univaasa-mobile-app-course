import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { 
    ListItem, 
    Text, 
    Radio, 
    Right, 
    Left,
    Textarea,
    Item,
    Label,
    DatePicker,
    Icon,
    H3
} from 'native-base'

export default class NewMoodField extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            value: null
        };
        
        if (this.props.field.type === 'date') {
            this.setDate = this.setDate.bind(this);
        }
    }

    componentDidMount() {
        this.setState({ value: this.props.field.value })

        if (this.props.field.type === 'date' && this.props.field.value === null) {
            const now = new Date()
            this.setState({ value: now })
            this.props.updateValue(this.props.fieldName, now)
        }
    }

    renderField(field) {
        if (field.type === 'radio' && field.options) {
            const options = field.options
            return (
                <>
                <H3>{field.text}</H3>
                {Object.keys(options).map((optionKey) => {
                    return (
                        <ListItem key={optionKey}>
                        <Left>
                            {this.getRadioButtonText(options[optionKey])}
                        </Left>
                        <Right>
                            <Radio 
                            selected={this.state.value === options[optionKey].value} 
                            onPress={() => this.onRadioPress(options[optionKey].value)} 
                            />
                        </Right>
                        </ListItem>
                    )
                })}
                </>
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
        if (field.type === 'date') {
            return (
                <>
                <DatePicker
                defaultDate={new Date()}
                maximumDate={new Date()}
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText={'Select date'}
                textStyle={{ color: "green" }}
                placeHolderTextStyle={{ color: "#d3d3d3" }}
                onDateChange={this.setDate}
                disabled={false}
                />
                {this.state.value && <Text style={styles.selectedDate}>{this.getSelectedDate()}</Text>}
                </>
            )
        }
    }

    getRadioButtonText(radioButtonOption) {
        if (radioButtonOption.showOptionAsIcon) {
            return this.teaserEmoji(radioButtonOption.value)
        }

        return <Text onPress={() => this.onRadioPress(radioButtonOption.value)}>{radioButtonOption.text}</Text>
    }

    onRadioPress(val) {
        const newValue = val
        this.setState({value: newValue})
        this.props.updateValue(this.props.fieldName, newValue)
    }

    updateTextInput(text) {
        const val = text
        this.setState({value: val})
        this.props.updateValue(this.props.fieldName, val)
    }

    setDate(date) {
        const newDate = date
        this.setState({ value: newDate })
        this.props.updateValue(this.props.fieldName, newDate)
    }

    getSelectedDate() {
        if (this.state.value) {
            let date = this.state.value.toString().substr(4, 12);

            if (date === new Date().toString().substr(4, 12)) {
                date += ' (TODAY)'
            }

            return date
        }

        return ''
    }

    teaserEmoji(overallMoodValue) {
        switch (overallMoodValue) {
            case 1:
                return (<Icon onPress={() => this.onRadioPress(overallMoodValue)} type="FontAwesome5" name="sad-cry" />)
                break
            case 2:
                return (<Icon onPress={() => this.onRadioPress(overallMoodValue)} type="FontAwesome" name="frown-o" />)
                break
            case 3:
                return (<Icon onPress={() => this.onRadioPress(overallMoodValue)} type="FontAwesome" name="meh-o" />)
                break
            case 4:
                return (<Icon onPress={() => this.onRadioPress(overallMoodValue)} type="FontAwesome" name="smile-o" />)
                break
            case 5:
                return (<Icon onPress={() => this.onRadioPress(overallMoodValue)} type="FontAwesome5" name="laugh-beam" />)
                break
            default:
        }
    }

    render() {
        return (
            <>{this.props.field && this.renderField(this.props.field)}</>
        );
    }
}

const styles = StyleSheet.create({
    selectedDate: {
        marginTop: 10,
        marginBottom: 20,
    },
})
