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
    const deadLineFunnel = '<!-- Deadline Funnel --><script type="text/javascript" data-cfasync="false">function SendUrlToDeadlineFunnel(e){var r,t,c,a,h,n,o,A,i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",d=0,l=0,s="",u=[];if(!e)return e;do r=e.charCodeAt(d++),t=e.charCodeAt(d++),c=e.charCodeAt(d++),A=r<<16|t<<8|c,a=A>>18&63,h=A>>12&63,n=A>>6&63,o=63&A,u[l++]=i.charAt(a)+i.charAt(h)+i.charAt(n)+i.charAt(o);while(d<e.length);s=u.join("");var C=e.length%3;var decoded = (C?s.slice(0,C-3):s)+"===".slice(C||3);decoded = decoded.replace("+", "-");decoded = decoded.replace("/", "_");return decoded;} var dfUrl = SendUrlToDeadlineFunnel(location.href); var dfParentUrlValue;try {dfParentUrlValue = window.parent.location.href;} catch(err) {if(err.name === "SecurityError") {dfParentUrlValue = document.referrer;}}var dfParentUrl = (parent !== window) ? ("/" + SendUrlToDeadlineFunnel(dfParentUrlValue)) : "";(function() {var s = document.createElement("script");s.type = "text/javascript";s.async = true;s.setAttribute("data-scriptid", "dfunifiedcode");s.src ="https://a.deadlinefunnel.com/unified/reactunified.bundle.js?userIdHash=eyJpdiI6ImZMdEsyVGNtMG12cUhSUlFJV3FlSWc9PSIsInZhbHVlIjoiNkJFSHVVZ3BUMXpQUThJNVFBQ3FOQT09IiwibWFjIjoiZTgxNjk5NzkzNzNhYmY3MjcxZWQ3OWZkYmUyYjJmOGRhMTE5MDdhMTExNjYyOGU0MjBhMDUzZGU3OGFiNzIwNyJ9&pageFromUrl="+dfUrl+"&parentPageFromUrl="+dfParentUrl;var s2 = document.getElementsByTagName("script")[0];s2.parentNode.insertBefore(s, s2);})();</script><!-- End Deadline Funnel -->';

    return (
      <div>
        <div className="content" style={{ fontSize: 14, fontWeight: 'bold' }} dangerouslySetInnerHTML={{__html: deadLineFunnel }}></div>
        <HeaderComponent />
        <div className="row justify-content-center">
          <div className="col-10 col-sm-7 col-md-5 col-lg-4">
            {/* <p className="text-center">***One-year membership only $15.99!***</p> */}
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
