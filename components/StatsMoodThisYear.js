import * as React from 'react'
import { Dimensions, View, StyleSheet, ScrollView } from 'react-native'
import { Spinner, Text, Picker } from 'native-base'
import firebase from 'react-native-firebase'
import { withNavigation } from 'react-navigation'
import { LineChart } from 'react-native-chart-kit'

class StatsMoodThisYear extends React.Component {
    state = { 
        currentUser: null,
        moods: null,
        thisYearOverallMoodData: null,
        isLoading: false,
        labels: [],
        selectedYear: null,
        years: null,
        dataExists: false
    }

    componentDidMount() {
        // show loading spinner
        let isLoading = true;
        // get current year
        const selectedYear = new Date().getFullYear()
        this.setState({ selectedYear, isLoading })
        // create year picker items
        this.setYearPickerItems()
        // get moods from parent component
        const moods = this.props.moods
        // get current user
        const { currentUser } = firebase.auth()
        // hide spinner
        isLoading = false
        // process stats data
        const thisYearOverallMoodData = this.thisYearOverallMoodData(moods, selectedYear)
        this.setState({ 
            currentUser, 
            moods, 
            thisYearOverallMoodData, 
            isLoading
        })
    }

    /**
     * Update stats on year picker value change
     * 
     * @param {*} value 
     */
    onYearChange(value) {
        this.setState({
          selectedYear: parseInt(value),
          isLoading: true
        });

        this.setState({ dataExists: false })
        const thisYearOverallMoodData = this.thisYearOverallMoodData(this.state.moods, parseInt(value))
        this.setState({ thisYearOverallMoodData, isLoading: false })
    }

    /**
     * Process overall mood data for selected year (current year by default)
     * 
     * @param {*} moods 
     * @param {*} year 
     */
    thisYearOverallMoodData(moods, year) {
        this.setState({ isLoading: true })
        // months in a year
        const monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December' ]
        const listOfMonthsAvg = []
        const currentYear = year

        // initialize properties for each month
        for (const name of monthNames) {
            listOfMonthsAvg.push({
                name, 
                avg: 0, 
                sum: 0,
                count: 0
            })
        }

        // calculate average overall mood for each month
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

        // month labels for graph
        const labels = []
        const data = []
        let dataExists = false
        for (const month of listOfMonthsAvg) {
            // only display months that actually have moods
            if (month.count > 0) {
                dataExists = true
                // add month to labels displayed in graph
                labels.push(month.name)
                // add avg value for month in graph
                data.push(month.avg)
            }
        }

        this.setState({labels, dataExists, isLoading: false })
        if (!dataExists) {
            return null
        }

        return [{
            data
        }]
    }

    /**
     * Create a year picker from current year - 1970
     */
    setYearPickerItems() {
        let currentYear = new Date().getFullYear()
        const years = [currentYear]
        
        // create year picker
        let i = 0
        while (currentYear > 1970) {
            i++
            currentYear--
            years.push(currentYear)
            if (i > 100) {
                break
            }
        }
        this.setState({years})
    }

    render() {
        if (this.state.isLoading || this.state.moods == null || this.state.years == null) {
            return (
                <View style={styles.spinnerContainer}>
                    <Spinner color='blue' />
                </View>
            )
        }

        if (this.state.dataExists && this.state.thisYearOverallMoodData && this.state.labels) {
            return (
                <View>
                    <Text>
                        Overall mood per year avg (5 = best, 1 = worst)
                    </Text>
                    {this.state.selectedYear && this.state.years && <Picker
                            note
                            mode="dropdown"
                            style={{ width: 120 }}
                            selectedValue={this.state.selectedYear.toString()}
                            onValueChange={this.onYearChange.bind(this)}
                            >
                            {
                                this.state.years.map((year) => {
                                    return (
                                        <Picker.Item 
                                        key={year.toString()} 
                                        label={year.toString()} 
                                        value={year.toString()} 
                                        />
                                    )
                                })
                            }
                    </Picker>}
                    
                    {/* 
                        Linechart example from https://www.npmjs.com/package/react-native-chart-kit 
                        Modified by Kim Lehtinen
                    */}
                    { this.state.thisYearOverallMoodData && 
                    <LineChart
                        data={{
                        labels: this.state.labels,
                        datasets: this.state.thisYearOverallMoodData
                        }}
                        width={Dimensions.get('window').width-18} // from react-native
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
                    }
                </View>
            );
        } else {
            return (
                <View>
                    <Text>
                        Overall mood per year (avg) 
                    </Text>
                    {this.state.selectedYear && this.state.years && <Picker
                            note
                            mode="dropdown"
                            style={{ width: 120 }}
                            selectedValue={this.state.selectedYear.toString()}
                            onValueChange={this.onYearChange.bind(this)}
                            >
                            {
                                this.state.years.map((year) => {
                                    return (
                                        <Picker.Item 
                                        key={year.toString()} 
                                        label={year.toString()} 
                                        value={year.toString()} 
                                        />
                                    )
                                })
                            }
                    </Picker>}
                    <Text>
                        No data to show for selected year
                    </Text>
                </View>
            )
        }
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
