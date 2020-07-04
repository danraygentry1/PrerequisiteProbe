import React from 'react';
import { connect } from 'react-redux';
import { orderProduct } from '../store/actions/order';
import { registerCouponToUser, registrationSuccess } from '../store/actions/authenticate';


import OrderPage from './OrderPage';
import { store} from '../store';

export class OrderPageContainer extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.sendOrder = this.sendOrder.bind(this);
    this.sendCoupon = this.sendCoupon.bind(this);
    this.sendRegistrationSuccess = this.sendRegistrationSuccess.bind(this);
  }


  sendOrder() {
    const { dispatch } = this.props;
    dispatch(orderProduct());
  }

  sendCoupon(formData) {
    const { dispatch } = this.props;
    dispatch(registerCouponToUser(formData.couponCode));

  }

  sendRegistrationSuccess() {
    const { dispatch } = this.props;
    dispatch(registrationSuccess(store.getState().authentication.userObj));
  }

  render() {
    const { authentication } = this.props;
    return (

      <OrderPage
        authentication={authentication}
        sendOrderFunction={this.sendOrder}
        sendCouponFunction={this.sendCoupon}
        sendRegistrationSuccessFunction={this.sendRegistrationSuccess}
      />
    );
  }
}

const mapStateToProps = (state) => ({ authentication: state.authentication });

export default connect(mapStateToProps)(OrderPageContainer);
