import React, { Component } from 'react';
import { Content, Footer, FooterTab, Button, Text, Icon } from 'native-base';
import Moods from './Moods'

export default class AppTabs extends Component {
  state = { 
    selectedTab: 'moods'
  }

  currentTab() {
    switch (this.state.selectedTab) {
      case 'moods':
        return (<Moods/>);
        break;
      case 'newmood':
        return (<Text>New mood</Text>);
        break;
        case 'stats':
          return (<Text>Stats</Text>);
          break;
      default:
    }
  }

  render() {
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