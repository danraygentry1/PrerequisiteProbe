import React from 'react';
import { Link } from 'react-router-dom';
import {
  AvForm, AvGroup, AvInput, AvFeedback,
} from 'availity-reactstrap-validation';
import { Button, Label } from 'reactstrap';
import { HeaderComponent } from './Header';
import { RegistrationPageContainer } from "./RegistrationPageContainer";
import * as mutations from '../store/mutations';
import { store } from '../store';


export default class OrderPage extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
    this.handleValidCouponSubmit = this.handleValidCouponSubmit.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
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

  // Handle submission once all form data is valid
  handleBackButton() {
    const { sendRegistrationSuccessFunction } = this.props;
    sendRegistrationSuccessFunction();
  }

  handleValidCouponSubmit() {
    const formData = this.state;
    const { sendCouponFunction } = this.props;
    sendCouponFunction(formData);
  }

  render() {
    return (
      <div className="container-fluid justify-content-center">
        <HeaderComponent />
        <div className="row p-3 justify-content-center">
          <div className="card p-3 col-md-5 border-dark">
            <AvForm onValidSubmit={this.handleValidSubmit}>
              <AvGroup />
              <div className="card border-0 flex-grow-0 f6lex align-items-center justify-content-center wizard-background">
                <div className="card-body">
                  <div className="card border-0 flex-grow-0 flex align-items-center justify-content-center wizard-background">
                    {store.getState().authentication.couponCodeId !== '' ? (
                      <div>
                        Click PayPal button to order a one-year membership for only $11.99!
                        <p align="center"><b>Promo Code Applied!</b></p>
                      </div>
                    )
                      : <p>Click PayPal button to order a one-year membership for only $14.99!</p>}
                    <br />
                    <button>
                      <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_200x51.png" alt="PayPal" />
                    </button>
                    <br />
                  </div>
                  <Button href="/register-user" color="primary" className="form-control mt2 btn btn-primary ">Go Back</Button>
                </div>
              </div>
            </AvForm>
          </div>
          <div className="card p-3 col-md-2 border-dark">
            <AvForm onValidSubmit={this.handleValidCouponSubmit}>
              <AvGroup>
                <Label for="couponCode">Promo Code</Label>
                <AvInput
                  id="couponCode"
                  name="couponCode"
                  onChange={this.handleInputChange}
                  onKeyPress={this.handleKeyPress}
                />
              </AvGroup>
              <Button color="primary">Apply</Button>
            </AvForm>
            <br />
            {store.getState().authentication.couponCodeId !== ''
              ? (
                <p align="right">
                  Cost: $14.99
                  <br />
                  <b>Discount:  (${Number(store.getState().authentication.couponCodePercent * 14.99).toFixed(2)})</b>
                  <br />
                  Total Cost: ${Number((1 - store.getState().authentication.couponCodePercent) * 14.99).toFixed(2)}
                </p>
              )
              : (
                <p align="right">
                  Cost: $14.99
                  <br />
                  Total Cost : $14.99
                </p>
              )}
          </div>
        </div>
      </div>
    );
  }
}
