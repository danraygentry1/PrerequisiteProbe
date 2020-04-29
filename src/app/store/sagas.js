import { take, put, select } from 'redux-saga/effects';
import uuid from 'uuid';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as mutations from './mutations';
import { history } from './history';
import { store } from '.';
import { REQUEST_PURCHASE_PRODUCT } from './mutations';

/* const url = process.env.NODE_ENV == 'production' ? '' : "http://localhost:8080"; //url used to communicate to the server */
const url = 'http://localhost:9229'; // url used to communicate to the server
// '' is the root (prereqfinder.com)
export function* taskCreationSaga() {
  while (true) {
    const { groupID } = yield take(mutations.REQUEST_TASK_CREATION); // when it gets the take it will stop until the specified action is dispatched
    const ownerID = 'U1';
    const taskID = uuid();
    yield put(mutations.createTask(taskID, groupID, ownerID));
    // createTask mutation can respond to the reducer without the reducer needing to be random in any way
    // put means what ever action we pass to it, send it into the store,
    const { res } = yield axios.post(`${url}/task/new`, {
      task: {
        id: taskID,
        group: groupID,
        owner: ownerID,
        isComplete: false,
        name: 'New task',
      }, // becomes the body property of the post request we're handling on the server
    });

    console.info('Got response,', res);
  }
} // saga to create task

export function* taskModificationSaga() {
  while (true) {
    const task = yield take([
      mutations.SET_TASK_GROUP,
      mutations.SET_TASK_NAME,
      mutations.SET_TASK_COMPLETE,
    ]);
    axios.post(`${url}/task/update`, {
      task: {
        id: task.taskID,
        group: task.groupID,
        name: task.name,
        isComplete: task.isComplete,
      }, // sends request to the server, which informs it of this user action
    });
  }
} // saga to update task

export function* userAuthenticationSaga() {
  while (true) {
    const { username, password } = yield take(mutations
      .REQUEST_AUTHENTICATE_USER);
    try {
      const { data } = yield axios.post(`${url}/authenticate`, { username, password });
      if (!data) {
        throw new Error();
      }

      console.log('AuthenticatedSSSS!', data);
      console.log('State Data');
      console.log(data.state.ptSchoolColumnsArray);
      console.log(url);

      yield put(mutations.setState(data.state));
      const tempState = store.getState();
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
export function* purchaseProductSaga() {
  while (true) {
    yield take(mutations.REQUEST_PURCHASE_PRODUCT);
    try {
      const { userObj } = store.getState();

      const paypalUrl = yield axios.post(`${url}/buysingle`, userObj);
      history.push(`/buysingle?${paypalUrl.data}`);


      /* yield axios.post(url + '/buysingle',  { params: {
                    "wenis": "wenis"
                }}) */
    } catch (e) {
      console.log(e.toString());
    }
  }
}
export function* createAccountSaga() {
  while (true) {
    const type = yield take(mutations.CREATE_ACCOUNT);
    try {
      // yield axios.post(url + '/');
      yield put(mutations.createAccount());

      history.push('./wizard');
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
export function* createUserSaga() {
  while (true) {
    const userObj = yield take(mutations.CREATE_USER);
    try {
      // add userObj to state
      const state = store.getState();
      state.userObj = userObj.userObj;

      yield put(mutations.setState(state));
    } catch (e) {
      console.log(e.toString());
    }
  }
}
