import React from 'react';
import {
  AvForm, AvGroup, AvInput, AvFeedback,
} from 'availity-reactstrap-validation';
import { Button, Label } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class ResetPasswordPage extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.clearPasswordReset = this.clearPasswordReset.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);

    // component state
    this.state = {
      emailAddress: '',
    };
  }

  // clear out the email form if we're rendering the success message.
  // runs before the render, and lets you see what props are coming in
  componentWillReceiveProps(nextProps) {
    const { isPasswordReset } = nextProps;
    if (isPasswordReset) {
      this.setState({ emailAddress: '' });
    }
  }

  // show the form again so a new email can be sent
  clearPasswordReset(e) {
    e.preventDefault();
    const { clearPasswordResetFunction } = this.props;
    clearPasswordResetFunction();
  }

  // update state as email value changes
  handleEmailChange(e) {
    this.setState({ emailAddress: e.target.value });
  }

  // catch enter clicks
  // helper function could be stored in another file, since multiple
  // components can use this same logic
  handleKeyPress(target) {
    if (target.charCode === 13) {
      this.handleValidSubmit();
    }
  }

  // Handle submission once all form data is valid
  handleValidSubmit() {
    const { resetPasswordFunction } = this.props;
    const formData = this.state;
    resetPasswordFunction(formData.emailAddress);
  }

  render() {
    const { isPasswordReset } = this.props;

    if (isPasswordReset) {
      return (
          <div className="row justify-content-center">
            <div className="col-10 col-sm-7 col-md-5 col-lg-4">
              <p>
                An email has been sent to the address you provided containing a link to reset
                your password. Please click that link to proceed with setting a new password.
              </p>
              <p>
                <a href="/account/reset-password" onClick={this.clearPasswordReset}>Re-send Email</a>
              </p>
            </div>
          </div>
      );
    }

    return (
      <div className="row justify-content-center">
        <div className="col-10 col-sm-7 col-md-5 col-lg-4">
          <p>
            If you‘d like to reset your password, please enter your email here
            and a link to do so will be sent to the address you enter.
          </p>
          <AvForm onValidSubmit={this.handleValidSubmit}>
            <AvGroup>
              <Label for="emailAddress">Email</Label>
              <AvInput
                id="emailAddress"
                name="emailAddress"
                onChange={this.handleEmailChange}
                onKeyPress={this.handleKeyPress}
                placeholder="spacey@gmail.com"
                required
                type="email"
                value={this.state.emailAddress}
              />
              <AvFeedback>A valid email is required to reset your password.</AvFeedback>
            </AvGroup>
            <Button color="primary">Reset Password</Button>
          </AvForm>
        </div>
      </div>
    );
  }
}
