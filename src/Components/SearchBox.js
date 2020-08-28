import React, { Component } from 'react';

class SearchBox extends Component {
        
    render() {
        return (
            <div className="search-box-container">
                <input className="search-box" type="text" placeholder="Search By Name" spellcheck="false" value={this.props.searchText} onChange={this.props.handleInput} />
            </div>
        )
    }
}

export default SearchBox;