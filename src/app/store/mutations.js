//template for all the changes to application state that we might want to do
export const REQUEST_TASK_CREATION = 'REQUEST_TASK_CREATION';
export const CREATE_TASK = 'CREATE_TASK';
export const SET_TASK_COMPLETE = 'SET_TASK_COMPLETE';
export const SET_TASK_GROUP = 'SET_TASK_GROUP';
export const SET_TASK_NAME = 'SET_TASK_NAME';
export const REQUEST_AUTHENTICATE_USER = 'REQUEST_AUTHENTICATE_USER';
export const PROCESSING_AUTHENTICATE_USER = 'PROCESSING_AUTHENTICATE_USER';
export const REQUEST_PURCHASE_PRODUCT = 'REQUEST_PURCHASE_PRODUCT';
export const CREATE_ACCOUNT =  'CREATE_ACCOUNT';
export const AUTHENTICATING = 'AUTHENTICATING';
export const AUTHENTICATED = 'AUTHENTICATED';
export const NOT_AUTHENTICATED = 'NOT_AUTHENTICATED';
export const  SET_STATE = 'SET_STATE';




export const requestTaskCreation = (groupID)=>({
    type:REQUEST_TASK_CREATION,
    groupID
})

export const createTask = (taskID, groupID, ownerID)=>({
    type:CREATE_TASK,
    taskID,
    groupID,
    ownerID
})//dispatched by the saga once this object is complete with it's own random id.

export const setTaskCompletion = (id, isComplete)=>({
    type:  SET_TASK_COMPLETE,
    taskID: id,
    isComplete
});

export const setTaskGroup = (id, groupID)=>({
    type:  SET_TASK_GROUP,
    taskID: id,
    groupID
});

export const setTaskName = (id, name)=>({
    type:  SET_TASK_NAME,
    taskID: id,
    name
});
export const requestAuthenticateUser = (username,password)=>({
    type:REQUEST_AUTHENTICATE_USER,
    username,
    password
})
export const processAuthenticateUser = (status = AUTHENTICATING, session = null)=>({
    type:  PROCESSING_AUTHENTICATE_USER,
    session,
    authenticated: status
});
export const requestPurchaseProduct = ()=>({
    type:  REQUEST_PURCHASE_PRODUCT
});
export const createAccount = (username)=>({
    type:  CREATE_ACCOUNT,
    username
});


export const setState = (state = {})=>({
    type:SET_STATE,
    state
})
