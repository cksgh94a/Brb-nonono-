import { combineReducers } from 'redux';

import { logInOut } from './logInOut';
import { strategy } from './strategy';

const reducers = combineReducers({
  logInOut,
  strategy
});

export default reducers;