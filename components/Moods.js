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
        showModal: false,
        markedDates: null,
    }

    componentDidMount() {
        this.state.moods = this.props.moods
        const { currentUser } = firebase.auth()
        this.setMarkedDates(this.props.moods)
        this.setState({ currentUser })
    }

    setMarkedDates(moods) {
        if (!(moods && moods.length)) {
            return
        }

        const markedDates = {}
        for (const mood of moods) {
            let moodDate = new Date(mood.date.toDate())
            moodDate = new Date( new Date(moodDate).setHours(15,0,0,0))
            moodDate = moodDate.toISOString().split('T')[0]
            markedDates[moodDate] = {selected: true, marked: true, selectedColor: 'blue'}
        }

        this.setState({ markedDates })
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

    /**
     * Select mood by date from calender
     * 
     * @param {*} day 
     */
    selectMoodByDate(day) {
        if (day && day.dateString && this.state.moods && this.state.moods.length) {
            for (const mood of this.state.moods) {
                const moodDate = new Date(mood.date.toDate())
                const selectedDate = new Date(day.dateString)

                if (moodDate.toDateString() === selectedDate.toDateString()) {
                    this.closeMoodCalendar()
                    this.openMood(mood)
                    return
                }
            }
        }
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
                        {this.state.markedDates && 
                        <Calendar
                            markedDates={this.state.markedDates}
                            onDayPress={(day) => this.selectMoodByDate(day)}
                        />
                        }
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
