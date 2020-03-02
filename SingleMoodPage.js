import React, { Component } from 'react'
import { BackHandler, StyleSheet, TouchableOpacity } from 'react-native'
import { H2, Item, Button, Label, Card, CardItem, Text, Icon, Left, Body } from 'native-base'
import { withNavigation, StackActions, NavigationActions } from 'react-navigation'
import moodFieldsJson from './assets/moodFields.json'
import firebase from 'react-native-firebase'

class SingleMoodPage extends Component {
    /*
        Page Single Mood 
    */

    constructor(props) {
        super(props)

        this.state = { 
            fields: null,
            singleMood: null,
            currentUser: null
        }

        this.deleteMood.bind(this)
        this.hardwareBackButtonClick = this.hardwareBackButtonClick.bind(this);
    }

    componentDidMount() {
        const { currentUser } = firebase.auth()
        const fields = JSON.parse(JSON.stringify(moodFieldsJson))
        delete fields["dates"]
        delete fields["overAllFeeling"]
        let singleMood = this.props.singleMood

        if (this.props.navigation.state.singleMood) {
            singleMood = this.props.navigation.state.singleMood
        }

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.hardwareBackButtonClick);
        this.setState({ fields, singleMood, currentUser })
    }
    
    hardwareBackButtonClick = () => {
        this.goBack();
        return true;
    }
    
    componentWillUnmount() {
        this.backHandler.remove()
    }

    /**
     * Get emoji/icon face based on overall mood
     * 
     * @param {*} overallMood
     */
    teaserEmoji(overallMood) {
        switch (overallMood) {
            case 1:
                return (<Icon type="FontAwesome5" name="sad-cry" />)
                break
            case 2:
                return (<Icon type="FontAwesome" name="frown-o" />)
                break
            case 3:
                return (<Icon type="FontAwesome" name="meh-o" />)
                break
            case 4:
                return (<Icon type="FontAwesome" name="smile-o" />)
                break
            case 5:
                return (<Icon type="FontAwesome5" name="laugh-beam" />)
                break
            default:
        }
    }

    /**
     * Check if mood date is today
     * 
     * @param {*} moodDate 
     * @return {boolean}
     */
    isMoodToday(moodDate) {
        return new Date() === new Date(moodDate.toDate())
    }

    /**
     * This function renders the actual field.
     * It's rendered differently depending on field type.
     * 
     * @param {*} field 
     * @param {string} fieldKey
     */
    renderField(field, fieldKey) {
        if (field.type === 'radio') {
            if (field.options) {
                const options = field.options
                return (
                    <>
                    {Object.keys(options).map((optionKey) => {
                        if (this.state.singleMood[fieldKey] == options[optionKey].value) {
                            return (
                                <Left key={optionKey}>
                                    {this.getRadioButtonText(options[optionKey])}
                                </Left>
                            )
                        }
                    })}
                    </>
                )
            } else if (this.state.singleMood[fieldKey]) {
                return (
                    <Left>
                        <Text>{field.text}</Text>
                    </Left>
                )
            }
            
        }
        // textarea
        if (field.type === 'textarea') {
            return (
                <Label>
                    <Text>{this.state.singleMood[fieldKey]}</Text>
                </Label>
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
            return this.teaserEmoji(radioButtonOption.value)
        }

        return <Text>{radioButtonOption.text}</Text>
    }

    openEditPage() {
        this.props.openEditMood(this.state.singleMood)
    }

    async deleteMood() {
        const user = this.state.currentUser
        const singleMood = this.state.singleMood
        const ref = firebase.firestore().collection("moods").where("user", "==", user.uid)
        const props = this.props
        
        await ref.get().then(function(q) {
            q.forEach(function(doc) {
                if (doc.id == singleMood.id) {
                    doc.ref.delete()
                    props.setActiveTab('moods')
                }
            });
        }).catch(function(error) {
            console.log("Error getting moods:", error);
        });
    }

    async goBack() {
        this.props.setActiveTab('moods')
    }

    render() {
        const singleMood = this.state.singleMood

        if (singleMood == undefined) {
            return (<Text>Loading</Text>);
        }

        return (
            <Card style={{flex: 0}}>
                <CardItem>
                    <TouchableOpacity onPress={() => this.goBack()} >
                        <Text><Icon type="FontAwesome5" name="chevron-left" /> Back</Text>
                    </TouchableOpacity>
                </CardItem>
                <CardItem>
                <Left>
                    {this.teaserEmoji(singleMood.overall_mood)}
                    <Body>
                        <Text>{new Date(singleMood.date.toDate()).toDateString()}</Text>
                        {this.isMoodToday(singleMood.date) && <Text note>TODAY</Text>}
                    </Body>
                </Left>
                </CardItem>
                {   this.state.fields &&
                    Object.keys(this.state.fields).map((subjectKey) => {
                        return (
                            <CardItem key={subjectKey}>
                                <Body>
                                    <H2>{this.state.fields[subjectKey].text}</H2>
                                    {Object.keys(this.state.fields[subjectKey].fields).map((fieldKey) => {
                                        return (
                                            <Item key={fieldKey}>
                                                {this.renderField(this.state.fields[subjectKey].fields[fieldKey], fieldKey)}
                                            </Item>
                                        )
                                    })}
                                </Body>
                            </CardItem>
                        )
                    })
                }
                <CardItem>
                    <Body>
                        <Button
                        style={styles.editButton}
                        onPress={() => this.openEditPage()}
                        full success rounded
                        >
                        <Text>Edit</Text>
                        </Button>
                        <Button
                        style={styles.deleteButton}
                        onPress={() => this.deleteMood()}
                        full danger rounded
                        >
                        <Text>Delete</Text>
                        </Button>
                    </Body>
                </CardItem>
            </Card>
        );
    }
}

export default withNavigation(SingleMoodPage)

const styles = StyleSheet.create({
    editButton: {
        marginTop: 40,
        marginBottom: 10,
    },
    deleteButton: {
        marginTop: 10,
        marginBottom: 40,
    }
})