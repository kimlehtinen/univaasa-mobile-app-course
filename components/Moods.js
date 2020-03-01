import * as React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Spinner, Text } from 'native-base'
import firebase from 'react-native-firebase'
import MoodTeaser from './MoodTeaser'
import { withNavigation } from 'react-navigation'

class Moods extends React.Component {
    state = { 
        currentUser: null,
        moods: null,
        isLoading: false
    }

    componentDidMount() {
        this.state.moods = this.props.moods
        const { currentUser } = firebase.auth()
        this.setState({ currentUser })
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
                {this.state.moods && this.state.moods.map((mood, i) => <MoodTeaser moodTeaser={mood} key={i} />)}
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
    }
})
