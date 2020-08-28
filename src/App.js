import React, { Component } from 'react';
import memoize from 'lodash/memoize';
import logo from './logo.svg';
import Loader from 'react-loader-spinner';
import './App.css';
import UserDataTable from './Components/UserDataTable'
import SearchBox from './Components/SearchBox'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userDetails: [],
      searchText: ""
    }
  }

  componentDidMount() {
    var currentContext = this;
    setTimeout(async function () {
      return await fetch('https://mock-server-user-access-logs.herokuapp.com/')
        .then(response => response.json())
        .then(data => {
          currentContext.setState({ userDetails: data.members, loading: false })
        })
    }, 1500);

  }

  handleSearchInput = (e) => {
    this.setState({ searchText: e.target.value });
  }

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

  filteredListMemo = memoize(this.filterUsers);

  render() {
    return (
      <div className="App">
        {!this.state.loading ? <div><header className="App-header">
          <div className="App-title">
            <p>User Acces Logs</p>
          </div>
          <div className="App-logo-container">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
        </header>
          <body className="App-body">
            <SearchBox searchText={this.state.searchText} handleInput={this.handleSearchInput} />
            <UserDataTable userDetails={this.filteredListMemo(this.state.searchText)} />
          </body>
        </div>
          : <div className="loader">
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
