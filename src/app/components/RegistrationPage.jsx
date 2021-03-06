import React from 'react';
import { Link } from 'react-router-dom';
import {
  AvForm, AvGroup, AvInput, AvFeedback,
} from 'availity-reactstrap-validation';
import { Button, Label } from 'reactstrap';
import { HeaderComponent } from './Header';
import { store } from '../store';


export default class RegistrationPage extends React.Component {
  constructor(props) {
    super(props);
    const { userObj } = props.authentication.userObj;
    if (userObj) {
      console.log(userObj.first_name);
    }


    // bound functions
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);

    // component state
    this.state = {
      password: '',
      passwordCheck: '',
    };
  }

  /* if user click "go back button" on the order page, the users data
    will be preserved; thus they won't have to re-enter their data' */
  // DELETE
  /*componentDidMount() {
    if (store.getState().authentication.userObj) {
      this.setState({
        firstName: store.getState().authentication.userObj.first_name,
        lastName: store.getState().authentication.userObj.last_name,
        userName: store.getState().authentication.userObj.user_name,
        emailAddress: store.getState().authentication.userObj.email_address,
      });
    }
  }*/


  // Handle input changes
  handleInputChange(e) {
    this.setState({ [e.currentTarget.id]: e.target.value });
  }

  //
  // catch enter clicks
  handleKeyPress(target) {
    if (target.charCode === 13) {
      target.preventDefault();
      this.handleValidSubmit();
    }
  }

  // Handle submission once all form data is valid
  handleValidSubmit() {
    const formData = this.state;
    const { sendUserFunction } = this.props;
    sendUserFunction(formData);
  }

  render() {
    return (

      <div>
        <HeaderComponent />
        <div className="row justify-content-center">
          <div className="col-10 col-sm-7 col-md-5 col-lg-4">
            <p className="text-center">***One-year membership only $14.99!***</p>
            <h3 className="text-center">Create Account</h3>

            <AvForm onValidSubmit={this.handleValidSubmit}>
              <AvGroup>
                <Label for="firstName">First Name</Label>
                <AvInput
                  id="firstName"
                  name="firstName"
                  onChange={this.handleInputChange}
                  onKeyPress={this.handleKeyPress}
                  required
                  value={this.state.firstName}
                />
              </AvGroup>
              <AvGroup>
                <Label for="lastName">Last Name</Label>
                <AvInput
                  id="lastName"
                  name="lastName"
                  onChange={this.handleInputChange}
                  onKeyPress={this.handleKeyPress}
                  required
                  value={this.state.lastName}
                />
              </AvGroup>
              <AvGroup>
                <Label for="userName">User Name</Label>
                <AvInput
                  id="userName"
                  name="userName"
                  onChange={this.handleInputChange}
                  onKeyPress={this.handleKeyPress}
                  required
                  value={this.state.userName}
                />
              </AvGroup>
              <AvGroup>
                <Label for="emailAddress">Email</Label>
                <AvInput
                  id="emailAddress"
                  name="emailAddress"
                  onChange={this.handleInputChange}
                  onKeyPress={this.handleKeyPress}
                  placeholder="spacey@gmail.com"
                  required
                  type="email"
                  value={this.state.emailAddress}
                />
                <AvFeedback>A valid email is required to reset your password.</AvFeedback>
              </AvGroup>
              <AvGroup>
                <Label for="password">Password</Label>
                <AvInput
                  id="password"
                  minLength="8"
                  name="password"
                  onChange={this.handleInputChange}
                  onKeyPress={this.handleKeyPress}
                  placeholder="password"
                  required
                  type="password"
                  value={this.state.password}
                />
                <AvFeedback>Passwords must be at least eight characters in length</AvFeedback>
              </AvGroup>
              <AvGroup>
                <Label for="password">Confirm Password</Label>
                <AvInput
                  id="passwordCheck"
                  minLength="8"
                  name="passwordCheck"
                  onChange={this.handleInputChange}
                  onKeyPress={this.handleKeyPress}
                  placeholder="password again"
                  required
                  type="password"
                  validate={{ match: { value: 'password' } }}
                  value={this.state.passwordCheck}
                />
                <AvFeedback>Passwords must match</AvFeedback>
              </AvGroup>

              <Button color="primary">Continue</Button>

            </AvForm>
          </div>
        </div>
      </div>
    );
  }
}
