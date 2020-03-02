import * as React from 'react'
import { Dimensions, View, StyleSheet, ScrollView } from 'react-native'
import { Spinner, Text } from 'native-base'
import firebase from 'react-native-firebase'
import { withNavigation } from 'react-navigation'
import { LineChart } from 'react-native-chart-kit'

class StatsMoodThisYear extends React.Component {
    state = { 
        currentUser: null,
        moods: null,
        thisYearOverallMoodData: [],
        isLoading: false,
        labels: []
    }

    componentDidMount() {
        let isLoading = true;
        this.setState({ isLoading })
        
        const moods = this.props.moods
        const { currentUser } = firebase.auth()
        isLoading = false
        const thisYearOverallMoodData = this.thisYearOverallMoodData(moods)
        this.setState({ currentUser, moods, thisYearOverallMoodData, isLoading })
    }

    thisYearOverallMoodData(moods) {
        this.setState({ isLoading: true })
        const monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December' ]
        const listOfMonthsAvg = []
        const currentYear = new Date().getFullYear()

        for (const name of monthNames) {
            listOfMonthsAvg.push({
                name, 
                avg: 0, 
                sum: 0,
                count: 0
            })
        }

        for (const mood of moods) {
            const moodDate = new Date(mood.date.toDate())
            const moodMonthIndex = moodDate.getMonth()
            const moodYear = moodDate.getFullYear()
            if (moodYear === currentYear) {
                // count each mood for month
                listOfMonthsAvg[moodMonthIndex].count += 1
                // keep track of total sum for month
                listOfMonthsAvg[moodMonthIndex].sum += mood.overall_mood
                // update avg mood for month
                listOfMonthsAvg[moodMonthIndex].avg = (listOfMonthsAvg[moodMonthIndex].sum / listOfMonthsAvg[moodMonthIndex].count)
            }
        }

        const labels = []
        const data = []
        for (const month of listOfMonthsAvg) {
            // only display months that actually have moods
            if (month.count > 0) {
                // add month to labels displayed in graph
                labels.push(month.name)
                // add avg value for month in graph
                data.push(month.avg)
            }
        }

        this.setState({labels, thisYearOverallMoodData: data, isLoading: false })

        return [{
            data
        }]
    }

    render() {
        if (this.state.isLoading || this.state.moods == null) {
            return (
                <View style={styles.spinnerContainer}>
                    <Spinner color='blue' />
                </View>
            )
        }

        return (
            <View>
                <Text>Overall mood this year (avg)</Text>
                
                {/* 
                    Linechart example from https://www.npmjs.com/package/react-native-chart-kit 
                    Modified by Kim Lehtinen
                */}
                <LineChart
                    data={{
                    labels: this.state.labels,
                    datasets: this.state.thisYearOverallMoodData
                    }}
                    width={Dimensions.get('window').width} // from react-native
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix=""
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                    }
                    }}
                    bezier
                    style={{
                    marginVertical: 8,
                    borderRadius: 16
                    }}
                />
            </View>
        );
    }
}

export default withNavigation(StatsMoodThisYear)

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
