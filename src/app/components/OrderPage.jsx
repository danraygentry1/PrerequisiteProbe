import React from 'react';
import { Link } from 'react-router-dom';
import {
  AvForm, AvGroup, AvInput, AvFeedback,
} from 'availity-reactstrap-validation';
import { Button, Label } from 'reactstrap';

export default class OrderPage extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);

  }

  // Handle input changes
  handleInputChange(e) {
    this.setState({ [e.currentTarget.id]: e.target.value });
  }

  // catch enter clicks
  handleKeyPress(target) {
    if (target.charCode === 13) {
      target.preventDefault();
      this.handleValidSubmit();
    }
  }

  // Handle submission once all form data is valid
  handleValidSubmit() {
    const { sendOrderFunction } = this.props;
    sendOrderFunction();
  }

  render() {
    return (
      <AvForm onValidSubmit={this.handleValidSubmit}>
        <AvGroup />
        <div className="card border-0 flex-grow-0 flex align-items-center justify-content-center wizard-background">
          <div className="card-body">
            <div className="card border-0 flex-grow-0 flex align-items-center justify-content-center wizard-background">
              Click PayPal button below to order!
              <br/>
              <br/>
              <button>
                <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_200x51.png" alt="PayPal" />
              </button>
              <br />
            </div>
            <Button href="/register-user" color="primary" className="form-control mt2 btn btn-primary ">Go Back</Button>
          </div>
        </div>
      </AvForm>
    );
  }
}
