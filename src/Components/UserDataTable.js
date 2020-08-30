import React, { Component } from 'react';

class UserDataTable extends Component {

    //Change parent state based on click on a user row
    openModal(user) {
        this.props.openUser(user);
    }

    render() {
        return (
            <div className="users-table-container">
                <table className="users-table">
                    {/*Table header*/}
                    <thead>
                        <tr className="users-table-header">
                            <th>User ID</th>
                            <th>User Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(this.props.userDetails.length > 0) ? this.props.userDetails.map(user => {
                            return (
                                //Open UserModal with the details of the User clicked
                                <tr key={user.id} onClick={() => this.openModal(user)}>
                                    <td>{user.id}</td>
                                    <td>{user.real_name}</td>
                                </tr>
                            )
                        })
                            :
                            //Display for 0 entries
                            <tr>
                                <td colSpan="2">No user activity found</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default UserDataTable;