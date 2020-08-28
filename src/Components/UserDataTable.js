import React, { Component } from 'react';

class UserDataTable extends Component {
    
    render() {
        return (
            <div className="users-table-container">
                <table className="users-table">
                    <tr className="users-table-header">
                        <th>User ID</th>
                        <th>User Name</th>
                    </tr>
                    {(this.props.userDetails.length > 0) ? this.props.userDetails.map(user => {
                        return (
                            <tr>
                                <td>{user.id}</td>
                                <td>{user.real_name}</td>
                            </tr>
                        )
                    })
                        :
                        <tr>
                            <td colSpan="2">No user activity found</td>
                        </tr>
                    }
                </table>
            </div>
        )
    }
}

export default UserDataTable;