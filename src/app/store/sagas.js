import { take, put, select } from 'redux-saga/effects';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as mutations from './mutations';
import { history } from './history';
//import appConfig from '../../server/server';


//const url = `http://${appConfig.url}`; // url used to communicate to the server

export function* userAuthenticationSaga() {
  while (true) {
    const { username, password } = yield take(mutations
      .REQUEST_AUTHENTICATE_USER);
    try {
      const { data } = yield axios.post('/authenticate', { username, password });
      if (!data) {
        throw new Error();
      }

      console.log('AuthenticatedSSSS!', data);
      console.log('State Data');
      console.log(data.state.ptSchoolColumnsArray);


      yield put(mutations.setState(data.state));
      yield put(mutations.processAuthenticateUser(mutations.AUTHENTICATED, data.state.session.userToken));

      // set authentication cookie to be alive during a user's session
      Cookies.set('auth', data.state.session.userToken);

      history.push('/dashboard');


    } catch (e) {
      console.log("can't authenticate");
      yield put(mutations.processAuthenticateUser(mutations.NOT_AUTHENTICATED));
    }
  }
} // use yield with async functions

export function* createAccountSaga() {
  while (true) {
    const type = yield take(mutations.CREATE_ACCOUNT);
    try {
      // yield axios.post(url + '/');
      yield put(mutations.createAccount());

      history.push('./register-user');
      // history.push('/dashboard');
      // history.push('../buysingle');
      // axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
      // axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
      // yield axios.post(url + '/buysingle');
    } catch (e) {
      console.log(e.toString());
    }
  }
}


