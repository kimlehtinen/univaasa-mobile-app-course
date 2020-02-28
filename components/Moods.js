import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native'
import { Spinner } from 'native-base'
import firebase from 'react-native-firebase'
import MoodTeaser from './MoodTeaser'
import { withNavigation } from 'react-navigation'

class Moods extends Component {
    state = { 
        currentUser: null,
        moods: null,
        isLoading: false
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('willFocus', () => {
            const { currentUser } = firebase.auth()
            this.setState({ currentUser })
            this.getMoods(currentUser)
        });
    }
  
    componentWillUnmount() {
        this._unsubscribe();
    }

    async getMoods(user) {
        this.setState({ isLoading: true })

        const ref = firebase.firestore().collection("moods").where("user", "==", user.uid)
        const moods = []
        
        await ref.get().then(function(q) {
            q.forEach(function(doc) {
                const mood = doc.data()
                mood['id'] = doc.id
                moods.push(mood)
            });
        }).catch(function(error) {
            console.log("Error getting moods:", error);
        });

        moods.sort((a, b) => new Date(a.date.toDate()) - new Date(b.date.toDate()));
        moods.reverse()

        this.setState({
            moods,
            isLoading: false
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
