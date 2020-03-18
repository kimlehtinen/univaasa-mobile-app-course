import * as React from 'react'
import { BackHandler } from 'react-native'
import { withNavigation } from 'react-navigation'
import StatsMoodThisWeek from './StatsMoodThisWeek'
import StatsMoodThisYear from './StatsMoodThisYear'

class Stats extends React.Component {
    /*
    A page that shows stats about user moods
    */

    constructor(props) {
        super(props)

        this.state = { 
            moods: null
        }

        this.hardwareBackButtonClick = this.hardwareBackButtonClick.bind(this);
    }

    componentDidMount() {
        // get moods from parent component that will be used for stats
        // and passed to stats child components
        const moods = this.props.moods

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.hardwareBackButtonClick);
        this.setState({ moods })
    }

    /**
     * Go back handler for hardware back button
     */
    hardwareBackButtonClick = () => {
        this.props.setActiveTab('moods')
        return true;
    }
    
    componentWillUnmount() {
        this.backHandler.remove()
    }

    render() {
        return (
            <>
            {
                this.state.moods &&
                <StatsMoodThisWeek moods={this.state.moods} />
            }
            {
                this.state.moods &&
                <StatsMoodThisYear moods={this.state.moods} />
            }
            </>
        );
    }
}

export default withNavigation(Stats)
