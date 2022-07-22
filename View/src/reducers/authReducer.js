import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { LOGIN_URL, REGISTER_URL, USER_URL } from '../API';
import { handleAlert, handleLoading } from './uiReducer';
import setAuthToken from '../setAuthToken';
import { isEmpty } from '../helpers';
import { socket } from '../SocketClient';

export const authReducer = createSlice({
	name: 'auth',
	initialState: {
		isAuthenticated: false,
		authUser: {},
		following: [],
		followers: [],
		noti: [],
		saved: [],
		online: [],
	},
	reducers: {
		SET_AUTH_USER: (state, action) => {
			return {
				...state,
				isAuthenticated: !isEmpty(action.payload),
				authUser: {
					_id: action.payload._id,
					username: action.payload.username,
					email: action.payload.email,
					coverPicture: action.payload.coverPicture,
					profilePicture: action.payload.profilePicture,
					desc: action.payload.desc,
				},
				following: action.payload.following,
				followers: action.payload.followers,
				noti: action.payload.noti,
				saved: action.payload.saved,
				online: [],
			};
		},

		SET_USER_SAVE: (state, action) => {
			return {
				...state,
				saved: action.payload.saved,
			};
		},

		ADD_USER_FOLLOWING: (state, action) => {
			return {
				...state,
				following: [action.payload, ...state.following],
			};
		},

		REMOVE_USER_FOLLOWING: (state, action) => {
			return {
				...state,
				following: state.following.filter((user) => user._id !== action.payload),
				online: state.online.filter((item) => item._id !== action.payload),
			};
		},

		ADD_USER_NOTI: (state, action) => {
			return {
				...state,
				noti: action.payload,
			};
		},

		READ_USER_NOTI: (state) => {
			return {
				...state,
				noti: state.noti.map((n) => {
					if (n.isRead) return n;
					return { ...n, isRead: true };
				}),
			};
		},

		ADD_USER_ONLINE: (state, action) => {
			return {
				...state,
				online: [action.payload, ...state.online],
			};
		},

		REMOVE_USER_ONLINE: (state, action) => {
			return {
				...state,
				online: state.online.filter((item) => item._id !== action.payload),
			};
		},

		UPDATE_USER: (state, action) => {
			return {
				...state,
				authUser: {
					...state.authUser,
					username: action.payload.username,
					email: action.payload.email,
					coverPicture: action.payload.coverPicture,
					profilePicture: action.payload.profilePicture,
					desc: action.payload.desc,
				},
			};
		},

		LOGOUT_USER: () => {
			return {
				isAuthenticated: false,
				authUser: {},
				following: [],
				followers: [],
				noti: [],
				saved: [],
				online: [],
			};
		},
	},
});
export default authReducer.reducer;

export const {
	SET_AUTH_USER,
	SET_USER_SAVE,
	ADD_USER_FOLLOWING,
	REMOVE_USER_FOLLOWING,
	ADD_USER_NOTI,
	READ_USER_NOTI,
	ADD_USER_ONLINE,
	REMOVE_USER_ONLINE,
	LOGOUT_USER,
	UPDATE_USER,
} = authReducer.actions;

// Actions
export const Login = (email, password) => async (dispatch) => {
	await dispatch(handleLoading(true));

	try {
		const bodyData = {
			password,
			email,
		};

		const result = await axios.post(LOGIN_URL, bodyData);

		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			await dispatch(SetNewToken({ ...result }));
		}
	} catch (e) {
		await dispatch(handleLoading(false));
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
	}
};

export const Register = (username, email, password) => async (dispatch) => {
	await dispatch(handleLoading(true));

	try {
		const bodyData = {
			username,
			password,
			email,
		};
		const result = await axios.post(REGISTER_URL, bodyData);

		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			await dispatch(SetNewToken({ ...result }));
		}
	} catch (e) {
		await dispatch(handleLoading(false));
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
	}
};

export const Logout = () => async (dispatch) => {
	await dispatch(handleLoading(true));
	localStorage.removeItem('token'); // bo token khoi localStorage
	await dispatch(LOGOUT_USER()); // log out state
	setAuthToken(false); // reset mac dinh header axios
	socket.disconnect(); // logout/dong page = disconnect
	await dispatch(handleLoading(false));
};

export const UpdateUser =
	(username, email, password, coverPicture, profilePicture, desc) => async (dispatch) => {
		try {
			const bodyData = {
				username,
				email,
				password,
				coverPicture: coverPicture,
				profilePicture: profilePicture,
				desc,
			};

			const result = await axios.put(`${USER_URL}`, bodyData);

			let responseOK = result && result.status === 200 && result.statusText === 'OK';
			if (responseOK) {
				// neu thanh cong
				const { user } = result.data;
				await dispatch(UPDATE_USER({ ...user }));
				await dispatch(handleLoading(false));
				await dispatch(handleAlert({ ...result.data, isAlert: true }));
			}
		} catch (e) {
			await dispatch(handleLoading(false));
			await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
		}
	};

export const ReadNoti = () => async (dispatch) => {
	try {
		const bodyData = { action: 'readNoti' };

		const result = await axios.put(`${USER_URL}`, bodyData);

		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			dispatch(READ_USER_NOTI());
		}
	} catch (e) {
		dispatch(handleAlert({ ...e.response.data, isAlert: true }));
	}
};

export const RemoveUser = () => async (dispatch) => {
	await dispatch(handleLoading(true));
	try {
		const result = await axios.delete(`${USER_URL}`);
		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			await dispatch(Logout());
			await dispatch(handleLoading(false));
			await dispatch(handleAlert({ ...result.data, isAlert: true }));
		}
	} catch (e) {
		await dispatch(handleLoading(false));
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
	}
};

export const GetAuthUser = (id) => async (dispatch) => {
	await dispatch(handleLoading(true));
	try {
		const bodyData = { action: 'authUser' };
		const user = await axios.post(`${USER_URL}${id}`, bodyData);
		let responseOK = user && user.status === 200 && user.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			await dispatch(SET_AUTH_USER({ ...user.data }));
			await dispatch(handleLoading(false));
			await dispatch(handleAlert({ ...user.data, isAlert: true }));

			return user;
		}
	} catch (e) {
		await dispatch(handleLoading(true));
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
		window.location.href = '/';
	}
};

export const SetNewToken = (newUser) => async (dispatch) => {
	const { token, user } = newUser.data;
	localStorage.setItem('token', token); // token vao localStorage
	setAuthToken(token); // mac dinh header axios la token
	await dispatch(SET_AUTH_USER(user));
	socket.connect(); // login/register = reconnect
	await dispatch(handleLoading(false));
	await dispatch(handleAlert({ ...newUser.data, isAlert: true }));
};
