import * as React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Spinner, Button, Icon, Text } from 'native-base'
import firebase from 'react-native-firebase'
import MoodTeaser from './MoodTeaser'
import { withNavigation } from 'react-navigation'
import Modal from 'react-native-modal'
import { Calendar } from 'react-native-calendars'

class Moods extends React.Component {
    state = { 
        currentUser: null,
        moods: null,
        isLoading: false,
        showModal: false
    }

    componentDidMount() {
        this.state.moods = this.props.moods
        const { currentUser } = firebase.auth()
        this.setState({ currentUser })
    }

    openMood(mood) {
        this.props.openMood(mood)
    }

    openMoodCalendar() {
        this.setState({
            showModal: true
        })
    }
    
    closeMoodCalendar() {
        this.setState({
            showModal: false
        })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.spinnerContainer}>
                    <Spinner color='blue' />
                </View>
            )
        }

        if (!(this.state.moods && this.state.moods.length)) {
            return (
                <View style={styles.container}>
                    <Text>No moods added yet</Text>
                </View>
            )
        }

        return (
            <ScrollView style={styles.container}>
                <View style={styles.calendarButtonContainer}>
                    <Button
                    onPress={() => this.openMoodCalendar()} 
                    rounded
                    style={styles.calendarButton}
                    >
                        <Icon type="FontAwesome" name="calendar" style={styles.calendarIcon} />
                    </Button>
                </View>
                <Modal 
                animationIn="slideInUp"
                animationOut="slideOutDown"
                isVisible={this.state.showModal}
                style={{backgroundColor:'white'}}
                onBackdropPress={()=>this.closeMoodCalendar()}
                onSwipeComplete={()=>this.closeMoodCalendar()}
                swipeDirection="right"
                >
                    <View style={{ flex: 1 }}>
                        <Calendar
                            markedDates={{
                                '2012-05-16': {selected: true, marked: true, selectedColor: 'blue'},
                                '2012-05-17': {marked: true},
                                '2012-05-18': {marked: true, dotColor: 'red', activeOpacity: 0},
                                '2012-05-19': {disabled: true, disableTouchEvent: true}
                            }}
                        />
                    </View> 
                </Modal>

                {this.state.moods && this.state.moods.map((mood, i) => <MoodTeaser openMood={this.openMood.bind(this)} moodTeaser={mood} key={i} />)}
            </ScrollView>
        );
    }
}

export default withNavigation(Moods)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 22
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarButtonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    calendarButton: {
        paddingTop: 4,
        paddingBottom: 4,
    },
    calendarIcon: {
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
