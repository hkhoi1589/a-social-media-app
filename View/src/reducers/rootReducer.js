import { combineReducers } from 'redux';

import authReducer from './authReducer';
import postReducer from './postReducer';
import userReducer from './userReducer';
import uiReducer from './uiReducer';

export default combineReducers({
	authReducer,
	postReducer,
	userReducer,
	uiReducer,
});
