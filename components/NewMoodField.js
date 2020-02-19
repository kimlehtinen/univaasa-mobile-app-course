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
    /*
        NewMoodField component is a child component inside NewMoodSubject component.
        One subject (parent to a field) can have multiple NewMoodField.
        NewMoodField is the actual field displayed in a form that users fill in.
        A form field value is passed from NewMoodField.js (Child) --> NewMoodSubject.js (Parent) --> NewMood.js (Grandparent/actual form).
        Form subjects and fields come from ../assets/moodFields.json.
    */

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

        // always set current date as default date if this field is a date (which day this mood will be saved on)
        if (this.props.field.type === 'date' && this.props.field.value === null) {
            const now = new Date()
            this.setState({ value: now })
            this.props.updateValue(this.props.fieldName, now)
        }
    }

    /**
     * This function renders the actual field.
     * It's rendered differently depending on field type.
     * 
     * @param {*} field 
     */
    renderField(field) {
        // radio button
        if (field.type === 'radio') {
            // if radio field has multiple options, render each option
            if (field.options) {
                const options = field.options
                return (
                    <>
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
            } else {
                return (
                    <ListItem>
                    <Left>
                        <Text onPress={() => this.onRadioPress()}>{field.text}</Text>
                    </Left>
                    <Right>
                        <Radio selected={this.state.value} onPress={() => this.onRadioPressStandard()} />
                    </Right>
                    </ListItem>
                )
            }
            
        }
        // textarea
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
        // date (picker)
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

    /**
     * A function that determines if a text or icon should be shown to describe single radio button
     * 
     * @param {*} radioButtonOption 
     */
    getRadioButtonText(radioButtonOption) {
        if (radioButtonOption.showOptionAsIcon) {
            return this.teaserEmojiIcon(radioButtonOption.value)
        }

        return <Text onPress={() => this.onRadioPress(radioButtonOption.value)}>{radioButtonOption.text}</Text>
    }

    /**
     * A function that updates field value on radio button press.
     * 
     * @param {*} val 
     */
    onRadioPress(val) {
        const newValue = val
        this.setState({value: newValue})
        this.props.updateValue(this.props.fieldName, newValue)
    }

    /**
     * A function that updates field value on radio buttons press.
     * This one is standard which toggles between true/false
     */
    onRadioPressStandard() {
        const newValue = !this.state.value
        this.setState({value: newValue})
        this.props.updateValue(this.props.fieldName, newValue)
    }

    /**
     * A function that updates input field value on change
     * 
     * @param {string} text 
     */
    updateTextInput(text) {
        const val = text
        this.setState({value: val})
        this.props.updateValue(this.props.fieldName, val)
    }

    /**
     * A function that updates datepicker field value
     * 
     * @param {*} date 
     */
    setDate(date) {
        const newDate = date
        this.setState({ value: newDate })
        this.props.updateValue(this.props.fieldName, newDate)
    }

    /**
     * A function that displays selected date.
     * It also shows if selected date is today.
     */
    getSelectedDate() {
        if (this.state.value) {
            let date = this.state.value.toString().substr(4, 12)
            if (date === new Date().toString().substr(4, 12)) {
                date += ' (TODAY)'
            }

            return date
        }

        return ''
    }

     /**
     * Get emoji/icon face based on overall mood
     * 
     * @param {*} overallMoodValue
     */
    teaserEmojiIcon(overallMoodValue) {
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
