
export default function reducer(state, action) {
  switch (action.type) {
    case 'AUTHENTICATION_ORDER_FAILURE':
    case 'AUTHENTICATION_ORDER_SUCCESS': {
      return state;
    }
    default: {
      return state;
    }
  }
}
