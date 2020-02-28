import React from 'react'
import { TouchableOpacity } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base'

class MoodTeaser extends React.Component {
    /*
        Teaser card component for single Mood 
    */

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

    render() {
        const moodTeaser = this.props.moodTeaser

        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SingleMoodPage', {singleMood: this.props.moodTeaser})}>
                <Card style={{flex: 0}}>
                    <CardItem>
                    <Left>
                        {this.teaserEmoji(moodTeaser.overall_mood)}
                        <Body>
                            <Text>{new Date(moodTeaser.date.toDate()).toDateString()}</Text>
                            {this.isMoodToday(moodTeaser.date) && <Text note>TODAY</Text>}
                        </Body>
                    </Left>
                    </CardItem>
                    <CardItem>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        );
    }
}

export default withNavigation(MoodTeaser)