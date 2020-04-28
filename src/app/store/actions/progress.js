/* functions will generate one action and dispatch it to redux
best to just have one creater (function) for each action.
you have to wrap the object in parenthesis or javascript thinks your
opening the function, not setting a return value */
export const incrementProgress = () => ({ type: 'INCREMENT_PROGRESS' });
export const decrementProgress = () => ({ type: 'DECREMENT_PROGRESS' });
