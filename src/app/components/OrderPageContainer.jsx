import React from 'react';
import { connect } from 'react-redux';
import { orderProduct } from '../store/actions/order';

import OrderPage from './OrderPage';

export class OrderPageContainer extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.sendOrder = this.sendOrder.bind(this);
  }


  sendOrder() {
    const { dispatch } = this.props;
    dispatch(orderProduct());
  }

  render() {
    const { authentication } = this.props;
    return (

      <OrderPage
        authentication={authentication}
        sendOrderFunction={this.sendOrder}
      />
    );
  }
}

const mapStateToProps = (state) => ({ authentication: state.authentication });

export default connect(mapStateToProps)(OrderPageContainer);
