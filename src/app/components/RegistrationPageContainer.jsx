import React from 'react';
import { connect } from 'react-redux';
import { registrationClear, registerUser } from '../store/actions/authenticate';

import RegistrationPage from './RegistrationPage';
import md5 from "md5";


export class RegistrationPageContainer extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.sendUser = this.sendUser.bind(this);
  }

  // Clear password changed state on unmount: when app is not displaying it
  /*componentwillUnmount() {
    const { dispatch } = this.props;
    dispatch(registrationClear());
  }*/

  sendUser(formData) {
    const { dispatch } = this.props;
    const userObj = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      user_name: formData.userName,
      password_hash: md5(formData.password),
      email_address: formData.emailAddress,
      subscribed: false,
    };
    dispatch(registerUser(userObj));
  }

  render() {
    const { authentication } = this.props;
    return (

      <RegistrationPage
        authentication={authentication}
        sendUserFunction={this.sendUser}
      />
    );
  }
}

const mapStateToProps = (state) => ({ authentication: state.authentication });

export default connect(mapStateToProps)(RegistrationPageContainer);
