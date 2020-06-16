import 'whatwg-fetch'; // import polyfill so that fetch works in most browsers
import { decrementProgress, incrementProgress } from './progress';
import { clearError } from './error';
import { history } from '../history';


export const passwordResetClear = () => ({ type: 'AUTHENTICATION_PASSWORD_RESET_CLEAR' });
export const passwordSaveFailure = (error) => ({ type: 'AUTHENTICATION_PASSWORD_SAVE_FAILURE', error });
export const passwordSaveSuccess = () => ({ type: 'AUTHENTICATION_PASSWORD_SAVE_SUCCESS' });
export const passwordResetHashCreated = () => ({ type: 'AUTHENTICATION_PASSWORD_RESET_HASH_CREATED' });
export const passwordResetHashFailure = (error) => ({ type: 'AUTHENTICATION_PASSWORD_RESET_HASH_FAILURE', error });
export const passwordSaveClear = () => ({ type: 'AUTHENTICATION_PASSWORD_SAVE_CLEAR' });
export const registrationSuccess = (userObj) => ({type: 'AUTHENTICATION_REGISTRATION_SUCCESS', userObj });
export const registrationFailure = (error) => ({ type: 'AUTHENTICATION_REGISTRATION_FAILURE', error });
export const registrationClear = () => ({ type: 'AUTHENTICATION_REGISTRATION_CLEAR' });


export function registerUser(userObj) {
  return async (dispatch) => {

    // clear the error box if it's displayed
    dispatch(clearError());

    // turn on spinner
    dispatch(incrementProgress());

    // contact the API
    await fetch(
      // where to contact
      '/getuser',
      // what to send
      {
        method: 'POST',
        body: JSON.stringify({ userObj }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((json) => {
        if (json.success) {
            history.push('/order');
          return dispatch(registrationSuccess(userObj));
        }
        return dispatch(registrationFailure(new Error(json.error.message ? 'Something went wrong while attempting to create the user. Please try again.' : json.error)));
      })
      .catch((error) => dispatch(registrationFailure(new Error(error.message || 'Something went wrong while attempting to create the user. Please try again.'))));

    // turn off spinner
    return dispatch(decrementProgress());
  };
}


// Send email to API for hashing
export function createHash(emailAddress) {
  return async (dispatch) => {

    // clear the error box if it's displayed
    dispatch(clearError());

    // turn on spinner
    dispatch(incrementProgress());

    console.log(`email ${emailAddress}`);

    // contact the API
    await fetch(
      // where to contact
      '/saveresethash',
      // what to send
      {
        method: 'POST',
        body: JSON.stringify({ emailAddress }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((json) => {
        if (json.success) {
          return dispatch(passwordResetHashCreated(json));
        }
        return dispatch(passwordResetHashFailure(new Error(json.error.message ? 'Something went wrong. Please try again' : json.error)));
      })
      .catch((error) => dispatch(passwordResetHashFailure(new Error(error.message || 'There was an error saving the password. Please try again.'))));

    // turn off spinner
    return dispatch(decrementProgress());
  };
}
// Save a user's password
export function savePassword(data) {
  return async (dispatch) => {

    // clear the error box if it's displayed
    dispatch(clearError());

    // turn on spinner
    dispatch(incrementProgress());

    // contact the API
    await fetch(
      // where to contact
      '/savepassword',
      // what to send
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then(async (json) => {
        if (json && json.success) {
          dispatch(passwordSaveSuccess());
        } else {
          dispatch(passwordSaveFailure(new Error(json.error.message ? 'There was an error saving the password. Please try again' : json.error)));
        }
      })
      .catch((error) => {
        dispatch(passwordSaveFailure(new Error(error.message || 'There was an error saving the password. Please try again.')));
      });

    // turn off spinner
    return dispatch(decrementProgress());
  };
}
