import React, { Component } from 'react';

//memoize required to avoid recomputing filtered users on change of state
import memoize from 'lodash/memoize';

import logo from './logo.svg';
import './App.css';

//import external component: loader
import Loader from 'react-loader-spinner';

//User-defined components
import UserDataTable from './Components/UserDataTable'
import SearchBox from './Components/SearchBox'
import UserModal from './Components/UserModal'

class App extends Component {
  constructor(props) {
    super(props);
    //Initialize main App state
    this.state = {
      loading: true,
      userDetails: [],
      searchText: "",
      modalIsOpen: false,
      selectedUser: {}
    }
  }

  componentDidMount() {
    var currentContext = this;

    //Timeout provided purely to give the loader some screen time
    setTimeout(async function () {

      //Pure JSON api fetch
      //Close loader after data fetch
      return await fetch('https://mock-server-user-access-logs.herokuapp.com/getUserLogs')
        .then(response => response.json())
        .then(data => {
          currentContext.setState({ userDetails: data.members, loading: false })
        })
    }, 800);
  }

  openModal = (user) => {
    this.setState({ modalIsOpen: true, selectedUser: user });
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  //Update search text on user input
  handleSearchInput = (e) => {
    this.setState({ searchText: e.target.value });
  }

  //Filter users from the database by the search text from the user
  filterUsers(searchText) {
    if (searchText === "") {
      return this.state.userDetails;
    }
    var filteredList = this.state.userDetails.filter(
      function (user) {
        return user.real_name.toLowerCase().includes(searchText.toLowerCase());
      }
    )
    return filteredList;
  }

  //memoize required to avoid recomputing filtered users on change of state.
  //Replicating Vue.js compute property
  filteredListMemo = memoize(this.filterUsers);

  render() {
    return (
      <div className="App">

        {/*Modal to display user activity of selected user based on date. Default date set to "Today"*/}
        <UserModal closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} selectedUser={this.state.selectedUser} />

        {/*Display main page after data fetch*/}
        {!this.state.loading
          ?
          <div>
            {/*Main page header*/}
            <header className="App-header">

              <div className="App-title">
                <p>User Acces Logs</p>
              </div>

              {/*React logo to go with overall React theme*/}
              <div className="App-logo-container">
                <img src={logo} className="App-logo" alt="logo" />
              </div>

            </header>

            {/*Main page body*/}
            <div className="App-body">

              {/*Search box to filter user entries based on name*/}
              <SearchBox searchText={this.state.searchText} handleInput={this.handleSearchInput} />

              {/*Data Table to display all (filtered) users sourced from the database along with their ID*/}
              <UserDataTable userDetails={this.filteredListMemo(this.state.searchText)} openUser={this.openModal} />
            </div>
          </div>
          : 
          <div className="loader">
            {/*React loader for added flair*/}
            {/*Alternative type="Puff"*/}
            <Loader
              type="Bars"
              color="#00BFFF"
              height={100}
              width={100}
            />
          </div>
        }
      </div>
    );
  }
}

export default App;
