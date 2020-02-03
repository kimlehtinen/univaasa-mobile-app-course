import React, { Component } from 'react'
import { Image } from 'react-native'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base'

export default class MoodTeaser extends Component {

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
                return ''
                break
            default:
        }
    }

    isMoodToday(moodDate) {
        return new Date() === new Date(moodDate.toDate())
    }

    render() {
        const mood = this.props.mood

        return (
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
                <Left>
                    <Button transparent textStyle={{color: '#87838B'}}>
                    <Icon name="logo-github" />
                    <Text>1,926 stars</Text>
                    </Button>
                </Left>
                </CardItem>
            </Card>
        );
    }
}