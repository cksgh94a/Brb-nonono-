import { combineReducers } from 'redux';

import { logInOut } from './logInOut';
import { strategy } from './strategy';
import { exchange } from './exchange';

const reducers = combineReducers({
  logInOut,
  strategy,
  exchange
});

export default reducers;