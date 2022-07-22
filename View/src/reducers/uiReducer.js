import { createSlice } from '@reduxjs/toolkit';

export const uiReducer = createSlice({
	name: 'ui',
	initialState: {
		isAlert: false,
		type: '',
		message: '',
		isLoading: false,
	},
	reducers: {
		handleAlert: (state, action) => {
			return {
				...state,
				isAlert: action.payload.isAlert,
				type: action.payload.type,
				message: action.payload.message,
			};
		},

		handleLoading: (state, action) => {
			return {
				...state,
				isLoading: action.payload,
			};
		},
	},
});

export const { handleAlert, handleLoading } = uiReducer.actions;

export default uiReducer.reducer;
