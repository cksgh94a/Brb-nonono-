import { combineReducers } from 'redux';

import { logInOut } from './logInOut';

const reducers = combineReducers({
  logInOut,
});

export default reducers;