import React, { Component } from 'react';

//import external compoenets
import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class SearchBox extends Component {
    constructor(props) {
        super(props);
        //Initialize component state
        this.state = {
            startDate: new Date()
        };

        this.afterOpenModal.bind(this);
    }

    //Convert unformatted dates to Date objects for finding access duration
    getDateObject = (unformattedDate) => {

        if (unformattedDate[3].slice(-2) === 'PM') {
            if (unformattedDate[3].charAt(1) === ':') {
                unformattedDate[3] = '0' + unformattedDate[3];
            }
            var hoursIn24Format = parseInt(unformattedDate[3].slice(0, 2)) + 12;
            unformattedDate[3] = hoursIn24Format.toString(10) + unformattedDate[3].slice(2);
        }
        return new Date(unformattedDate[0] + ' ' + unformattedDate[1] + ',' + unformattedDate[2] + ' ' + unformattedDate[3].slice(0, -2) + ':00');
    }

    //Calculate access durations of each activity of selected user once
    //Better, more complex way is to calculate access duration on date selection and then memoize/cache the results
    afterOpenModal(currentContext) {
        if (currentContext.props.modalIsOpen) {
            var activity_periods = currentContext.props.selectedUser.activity_periods;

            for (var i = 0; i < activity_periods.length; i++) {

                //Convert unformatted dates to Date objects
                var startDateObject = currentContext.getDateObject(activity_periods[i].start_time.split(' '));
                var endDateObject = currentContext.getDateObject(activity_periods[i].end_time.split(' '));

                var timeDifferenceInMilliSeconds = endDateObject - startDateObject;

                //Extract days, hours and minutes of access duration from milliseconds
                var minutes = Math.floor((timeDifferenceInMilliSeconds / (1000 * 60)) % 60);
                var hours = Math.floor((timeDifferenceInMilliSeconds / (1000 * 60 * 60)) % 24);
                var days = Math.floor(timeDifferenceInMilliSeconds / (1000 * 60 * 60 * 24));
                currentContext.props.selectedUser.activity_periods[i].access_duration = minutes.toString(10) + " minute" + (minutes === 1 ? '' : 's');
                if (hours > 0) {
                    currentContext.props.selectedUser.activity_periods[i].access_duration = hours.toString(10) + " hour" + (hours === 1 ? '' : 's') + ", " + currentContext.props.selectedUser.activity_periods[i].access_duration;
                }
                if (days > 0) {
                    currentContext.props.selectedUser.activity_periods[i].access_duration = days.toString(10) + " day" + (days === 1 ? '' : 's') + ", " + currentContext.props.selectedUser.activity_periods[i].access_duration;
                }
            }
        }
    }

    //Month mappings required as dates from source not standardized
    monthMappings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    //Declare styles for external React Modal
    customStyles = {
        content: {
            top: '15%',
            left: '16.5%',
            transform: 'translate(-8%, -8%)',
            backgroundColor: '#252830',
            borderColor: 'black'
        }
    };

    //Update selected date on user input
    handleChange = date => {
        this.setState({
            startDate: date
        });
    };

    //Reset date to "Today" and close Modal
    closeModal = () => {
        this.setState({
            startDate: new Date()
        });
        this.props.closeModal();
    }

    //Retrun selected date when no user activity is found
    getSearchDate() {
        return ' on ' + this.monthMappings[this.state.startDate.getMonth()] + ' ' + this.state.startDate.getDate() + ' ' + this.state.startDate.getFullYear();
    }

    //Filter activity periods of the user by the date selected by the user
    filterDates(searchDate) {

        //Prevent filter calculations when unnecessary, exit early
        if (!this.props.modalIsOpen || this.props.selectedUser.activity_periods.length === 0) {
            return [];
        }

        //Date formatting to check equality
        if ((typeof searchDate) === 'object') {
            searchDate = this.monthMappings[searchDate.getMonth()] + ' ' + searchDate.getDate() + ' ' + searchDate.getFullYear();
        }

        //Filter user activity, include either start or end datetime matches
        var filteredList = this.props.selectedUser.activity_periods.filter(
            function (activity_period) {

                //Date formatting to check equality, not required if database entries are standardized
                var extractedStartDate = activity_period.start_time.split(' ').slice(0, -1).join(' ');
                var extractedEndDate = activity_period.end_time.split(' ').slice(0, -1).join(' ');

                var checkStartDate = (extractedStartDate === searchDate);

                //Check end date only if start date does not match
                if (checkStartDate) {
                    return true;
                }
                var checkEndDate = (extractedEndDate === searchDate);

                return checkEndDate;
            }
        )
        return filteredList;
    }

    render() {
        return (

            //Modal Component definition
            <Modal
                isOpen={this.props.modalIsOpen}
                onRequestClose={this.props.closeModal}
                style={this.customStyles}
                contentLabel="Example Modal"
                overlayClassName="Overlay"
                onAfterOpen={this.afterOpenModal(this)}
            >
                {/*Modal header: User timezone, Name, Search Date to filter user activity*/}
                <div className="modal-header">
                    <div className="user-timezone">User Time Zone : {this.props.selectedUser.tz}</div>
                    <div className="modal-title">{this.props.selectedUser.real_name}</div>
                    <div className="user-date-picker-container">
                        <DatePicker
                            className="user-date-picker"
                            selected={this.state.startDate}

                            onChange={this.handleChange}
                            dateFormat="MMM d yyyy"
                        />
                    </div>
                </div>
                <hr />

                {/*User activity table*/}
                <table className="access-table">
                    <thead>
                        <tr>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Access Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(this.props.modalIsOpen && this.filterDates(this.state.startDate).length) ? this.filterDates(this.state.startDate).map(activity => {
                            return (
                                <tr>
                                    <td>{activity.start_time}</td>
                                    <td>{activity.end_time}</td>
                                    <td>{activity.access_duration}</td>
                                </tr>
                            )
                        })
                            :
                            //Display for 0 entries
                            <tr>
                                <td colSpan="3">No user activity found{this.props.modalIsOpen && this.getSearchDate()}</td>
                            </tr>
                        }
                    </tbody>
                </table>

                <hr className="modal-content-separator" />

                {/*Exit modal and reset searchDate*/}
                <button className="close-btn" onClick={this.closeModal}>Close</button>
            </Modal>
        )
    }
}

export default SearchBox;