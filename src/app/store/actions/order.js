import 'whatwg-fetch'; // import polyfill so that fetch works in most browsers
import { decrementProgress, incrementProgress } from './progress';
import { clearError } from './error';
import { store } from '..';
import { history } from '../history';

export const orderFailure = (error) => ({ type: 'AUTHENTICATION_ORDER_FAILURE', error });
export const orderSuccess = () => ({ type: 'AUTHENTICATION_ORDER_SUCCESS' });

export function orderProduct() {
  return async (dispatch) => {
    const { authentication } = store.getState()

    // clear the error box if it's displayed
    dispatch(clearError());

    // turn on spinner
    dispatch(incrementProgress());

    // contact the API
    await fetch(
      // where to contact
      '/buysingle',
      // what to send
      {
        method: 'POST',
        body: JSON.stringify(authentication.userObj),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
          //response.redirect(response.url);
        }
        return null;
      })
      .then((json) => {
        if (json.success) {
          history.push(`/buysingle?${json.url}`);
          dispatch(orderSuccess());
        }
        if (json.error) {
          return dispatch(orderFailure(new Error(json.error.message ? 'Something went wrong with the order. Please try again.' : json.error)));
        }
        return null;
      })
      .catch((error) => dispatch(orderFailure(new Error(error.message || 'Something went wrong with the order. Please try again.'))));

    // turn off spinner
    return dispatch(decrementProgress());
  };
}


