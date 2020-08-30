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

    //Filter activity periods of the user by the date selected by the user
    filterDates(searchDate) {

        //Prevent filter calculations when unnecessary, exit early
        if(!this.props.modalIsOpen || this.props.selectedUser.activity_periods.length === 0) {
            return [];
        }
        var uh = this.monthMappings[searchDate.getMonth()];
        //Date formatting to check equality
        debugger;
        if((typeof searchDate) === 'object'){
            searchDate = this.monthMappings[searchDate.getMonth()] + ' ' + searchDate.getDate() +  ' ' + searchDate.getFullYear();
        }
        debugger;
        
        //Filter user activity, include either start or end datetime matches
        var filteredList = this.props.selectedUser.activity_periods.filter(
          function (activity_period) {
            
            //Date formatting to check equality, not required if database entries are standardized
            var extractedStartDate = activity_period.start_time.split(' ').slice(0, -1).join(' ');
            var extractedEndDate = activity_period.end_time.split(' ').slice(0, -1).join(' ');
            
            var checkStartDate = ( extractedStartDate === searchDate );

            //Check end date only if start date does not match
            if(checkStartDate){
                return true;
            }
            var checkEndDate = ( extractedEndDate === searchDate );
            
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
                    <tr>
                        <th>Start Time</th>
                        <th>End Time</th>
                    </tr>
                    {(this.props.modalIsOpen && this.filterDates(this.state.startDate).length) ? this.filterDates(this.state.startDate).map(activity => {
                        return (
                            <tr>
                                <td>{activity.start_time}</td>
                                <td>{activity.end_time}</td>
                            </tr>
                        )
                    })
                        :
                        //Display for 0 entries
                        <tr>
                            <td colSpan="2">No user activity found on {this.monthMappings[this.state.startDate.getMonth()] + ' ' + this.state.startDate.getDate() +  ' ' + this.state.startDate.getFullYear()}</td>
                        </tr>
                    }
                </table>

                <hr className="modal-content-separator" />
                
                {/*Exit modal and reset searchDate*/}
                <button className="close-btn" onClick={this.closeModal}>Close</button>
            </Modal>
        )
    }
}

export default SearchBox;