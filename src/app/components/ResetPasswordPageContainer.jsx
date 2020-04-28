import React from 'react';
import { connect } from 'react-redux';
import { createHash, passwordResetClear } from '../store/actions/authenticate';

import ResetPasswordPage from './ResetPasswordPage';

export class ResetPasswordPageContainer extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.clearPasswordResetFunction = this.clearPasswordResetFunction.bind(this);
    this.resetPasswordRequest = this.resetPasswordRequest.bind(this);
  }

  clearPasswordResetFunction() {
    const { dispatch } = this.props;
    dispatch(passwordResetClear());
  }

  resetPasswordRequest(emailAddress) {
    const { dispatch } = this.props;
    dispatch(createHash(emailAddress));
  }

  render() {
    const { isPasswordReset } = this.props.authentication;
    return (
      <ResetPasswordPage
        clearPasswordResetFunction={this.clearPasswordResetFunction}
        isPasswordReset={isPasswordReset}
        resetPasswordFunction={this.resetPasswordRequest}
      />
    );
  }
}

const mapStateToProps = (state) => ({ authentication: state.authentication });

export default connect(mapStateToProps)(ResetPasswordPageContainer);
