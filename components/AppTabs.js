import React, { Component } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Content, Footer, FooterTab, Button, Text, Icon, Spinner } from 'native-base'
import Moods from './Moods'
import NewMood from './NewMood'
import firebase from 'react-native-firebase'

export default class AppTabs extends Component {
  state = { 
    selectedTab: 'moods', // default tab
    moods: null,
    isLoading: false
  }

  /**
   * A function that always show currently selected tab
   */
  currentTab() {
    switch (this.state.selectedTab) {
      case 'moods':
        return (
          this.state.moods && 
          <Moods moods={this.state.moods}/>
        );
        break;
      case 'newmood':
        return (<NewMood setActiveTab={this.setActiveTab.bind(this)}/>);
        break;
        case 'stats':
          return (<Text>Stats</Text>);
          break;
      default:
    }
  }

  setActiveTab(tab) {
    console.log('Change tab')
    const selectedTab = tab
    this.setState({selectedTab})

    if (tab == 'moods') {
      this.getMoods(this.state.currentUser)
    }
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.getMoods(currentUser)
    this.setState({ currentUser })
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
        <>
          <Content padder>
            {this.currentTab()}
          </Content>
          <Footer>
            <FooterTab>
              <Button 
              active={this.state.selectedTab==='moods'}
              onPress={() => this.setState({selectedTab: 'moods'})}
              >
                <Icon type="FontAwesome" name="smile-o" />
                <Text>Moods</Text>
              </Button>
              <Button 
              active={this.state.selectedTab==='newmood'}
              onPress={() => this.setState({selectedTab: 'newmood'})}
              >
                <Icon type="FontAwesome" name="plus" />
                <Text>New Mood</Text>
              </Button>
              <Button
              active={this.state.selectedTab==='stats'}
              onPress={() => this.setState({selectedTab: 'stats'})}
              >
              <Icon type="Entypo" name="bar-graph" />
                <Text>Stats</Text>
              </Button>
            </FooterTab>
          </Footer>
        </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flex: 1,
    justifyContent: 'center',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})