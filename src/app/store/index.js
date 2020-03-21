//This file holds the redux store
import { createStore, applyMiddleware, combineReducers} from 'redux'
//applymiddleware needed for createlogger to work
//combineReducers - can create a reducer that deals with each collection in our state differently
import { defaultState } from '../../server/defaultState'
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';


const sagaMiddleware = createSagaMiddleware({
    onError: () => {
        store.dispatch({ type: 'SET_ERROR_STATE' })
    }
})
// import * as sagas from './sagas.mock'; //appears to not be working.  Double check.
import * as sagas from './sagas';


import * as mutations from './mutations';

export const store = createStore(
    combineReducers({
        session(userSession = defaultState.session || {}, action){
            let {type,authenticated,userToken} = action;
            switch (type) {
                case mutations.SET_STATE:
                    return {...userSession, id:action.state.session.id, userToken:action.state.session.userToken}
                case mutations.REQUEST_AUTHENTICATE_USER:
                    return {...userSession, authenticated:mutations.AUTHENTICATING}; //tells app we are in the process of authenticating
                case mutations.PROCESSING_AUTHENTICATE_USER:
                    return {...userSession, authenticated, userToken};
                default:
                    return userSession
            }
        },
        ptSchoolColumnsArray( ptSchoolColumnsArray = [], action){
            switch (action.type) {
                case mutations.SET_STATE:
                    return action.state.ptSchoolColumnsArray;
                default: return ptSchoolColumnsArray
            }
        },
        ptSchoolRowsArray( ptSchoolRowsArray = [], action){
            switch (action.type) {
                case mutations.SET_STATE:
                    return action.state.ptSchoolRowsArray;
                default: return ptSchoolRowsArray
            }
        },
        ptSchoolCourseRowsArray( ptSchoolCourseRowsArray = [], action){
            switch (action.type) {
                case mutations.SET_STATE:
                    return action.state.ptSchoolCourseRowsArray;
                default: return ptSchoolCourseRowsArray
            }
        },
        userObj (userObj = "", action){
            switch (action.type) {
                case mutations.SET_STATE:
                    return action.state.userObj;
                default: return userObj
            }
        },
        userName (userName = "", action){
            switch (action.type) {
                case mutations.SET_STATE:
                    return action.state.userName;
                case mutations.CREATE_ACCOUNT:
                    return userName
                default: return userName
            }
        }
      /*  userToken (userToken = "", action){
            switch (action.type) {
                case mutations.SET_STATE:
                    return action.state.userToken;
                default: return userToken
            }
        }*/
        /*tasks(tasks = [], action){
            switch (action.type) {
                case mutations.SET_STATE:
                        return action.state.tasks;
                case mutations.CREATE_TASK:
                    return[...tasks, {
                        id:action.taskID,
                        name:"New Task",
                        group:action.groupID,
                        owner:action.ownerID,
                        isComplete: false
                    }] //returns all the tasks plus a new task
                case mutations.SET_TASK_COMPLETE:
                    return tasks.map(task=>{
                        return (task.id === action.taskID ?
                            {...task,isComplete:action.isComplete} :
                            task)
                    })
                case mutations.SET_TASK_NAME:
                    return tasks.map(task=>{
                        return (task.id === action.taskID ?
                            {...task,name:action.name} :
                            task)
                    })
                case mutations.SET_TASK_GROUP:
                    return tasks.map(task=>{
                        return (task.id === action.taskID ?
                            {...task,group:action.groupID} :
                            task)
                    })
            } //... means everything in tasks
            return tasks;


        },
        comments(comments = []){
            return comments;
        },
        groups(groups = [], action){
            switch (action.type) {
                case mutations.SET_STATE:
                    return action.state.groups;
            }
            return groups;
        },
        users(users = []){
            return users;
        },*/

    }),
    applyMiddleware(createLogger(), sagaMiddleware)

);
for (let saga in sagas){
    sagaMiddleware.run(sagas[saga])
}


