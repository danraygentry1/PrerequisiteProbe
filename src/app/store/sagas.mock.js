//.mock extension indicates the file does not contain true business logic
//mocks are used in testing frameworks like jest
import {
    take,
    put,
    select
} from 'redux-saga/effects'

import * as mutations from './mutations';
import uuid from 'uuid'

export function* taskCreationSaga(){
    while (true) {
        const {groupID} = yield take(mutations.REQUEST_TASK_CREATION); //when it gets the take it will stop until the specified action is dispatched
        const ownerID = 'U1'
        const taskID = uuid();
        yield put(mutations.createTask(taskID, groupID, ownerID))
        //createTask mutation can respond to the reducer without the reducer needing to be random in any way
        //put means what ever action we pass to it, send it into the store,
        console.log("got group ID", groupID)

    }
} //saga to create task