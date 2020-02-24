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
        const mood = this.props.mood

        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SingleMoodPage', {mood: this.props.mood})}>
                <Card style={{flex: 0}}>
                    <CardItem>
                    <Left>
                        {this.teaserEmoji(mood.overall_mood)}
                        <Body>
                            <Text>{new Date(mood.date.toDate()).toDateString()}</Text>
                            {this.isMoodToday(mood.date) && <Text note>TODAY</Text>}
                        </Body>
                    </Left>
                    </CardItem>
                    <CardItem>
                    {/*<Left>
                        <Button transparent textStyle={{color: '#87838B'}}>
                        <Icon name="logo-github" />
                        <Text>1,926 stars</Text>
                        </Button>
                    </Left>
                    */}
                    </CardItem>
                </Card>
            </TouchableOpacity>
        );
    }
}

export default withNavigation(MoodTeaser)