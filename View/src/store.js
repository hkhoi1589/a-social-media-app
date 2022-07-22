import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../src/reducers/rootReducer';

export default configureStore({
	reducer: rootReducer,
});
