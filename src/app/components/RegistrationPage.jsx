import React from 'react';
import { Link } from 'react-router-dom';
import {
  AvForm, AvGroup, AvInput, AvFeedback,
} from 'availity-reactstrap-validation';
import { Button, Label } from 'reactstrap';
import {HeaderComponent} from "./Header";


export default class RegistrationPage extends React.Component {
  constructor(props) {
    super(props);
    const { userObj } = props.authentication.userObj;

    /* if user click "go back button" on the order page, the users data
    will be preserved; thus they won't have to re-enter their data' */
    //DELETE
    if (userObj) {
      this.state({
        firstName: userObj.first_name,
        lastName: userObj.last_name,
        userName: userObj.user_name,
        emailAddress: userObj.email_address,
        password: userObj.password,
      });
    }

    // bound functions
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);


    /* componentDidMount() {
      const { userObj } = this.props.authentication.userObj;
      userObj.first_name, userObj.last_name, userObj.user_name, userObj.password_hash, userObj.email_address,
      this.setState({
        firstName: userObj.first_name,
            lastName: userObj.last_name,
            userName: userObj.user_name,
            emailAddress: userObj.email_address
            password: userObj.password

      })
    } */

    // component state
    this.state = {
      password: '',
      passwordCheck: '',
    };
  }

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
          <HeaderComponent/>
          <div className="row justify-content-center">
            <div className="col-10 col-sm-7 col-md-5 col-lg-4">
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