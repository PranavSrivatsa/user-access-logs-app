import React, { Component } from 'react';

class SearchBox extends Component {
        
    render() {
        return (
            //Search box to filter user entries based on name
            <div className="search-box-container">
                <input className="search-box" type="text" placeholder="Search By Name" spellCheck="false" value={this.props.searchText} onChange={this.props.handleInput} />
            </div>
        )
    }
}

export default SearchBox;