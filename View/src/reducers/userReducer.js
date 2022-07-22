import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { handleAlert, handleLoading } from './uiReducer';
import { ADD_USER_FOLLOWING, REMOVE_USER_FOLLOWING } from './authReducer';
import { USER_URL, SEARCH_URL, FOLLOW_URL, UNFOLLOW_URL } from '../API';
import { socket } from '../SocketClient';

export const userReducer = createSlice({
	name: 'user',
	initialState: {
		currUser: {},
		userFollowing: [],
		userFollowers: [],
		randomFriend: [],
	},
	reducers: {
		GET_RANDOM_FRIEND: (state, action) => {
			return {
				...state,
				randomFriend: action.payload,
			};
		},

		REMOVE_RANDOM_FRIEND: (state, action) => {
			return {
				...state,
				randomFriend: state.randomFriend.filter((item) => item._id !== action.payload),
			};
		},

		GET_USER: (state, action) => {
			return {
				...state,
				currUser: {
					_id: action.payload._id,
					username: action.payload.username,
					email: action.payload.email,
					coverPicture: action.payload.coverPicture,
					profilePicture: action.payload.profilePicture,
					desc: action.payload.desc,
				},
				userFollowing: action.payload.following,
				userFollowers: action.payload.followers,
			};
		},

		CLEAR_USER: (state) => {
			return {
				...state,
				currUser: {},
				userFollowing: [],
				userFollowers: [],
			};
		},

		SET_CURRUSER_FOLLOWERS: (state, action) => {
			return {
				...state,
				userFollowers: action.payload.followers,
			};
		},
	},
});

export const {
	GET_RANDOM_FRIEND,
	REMOVE_RANDOM_FRIEND,
	GET_USER,
	CLEAR_USER,
	SET_CURRUSER_FOLLOWERS,
} = userReducer.actions;

export default userReducer.reducer;

export const RandomFriend = (excludeList) => async (dispatch) => {
	try {
		const result = await axios.post(`${USER_URL}`, { excludeList });
		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			await dispatch(GET_RANDOM_FRIEND([...result.data]));
		}
	} catch (e) {
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
	}
};

export const SearchFriend = (username, excludeList) => async (dispatch) => {
	try {
		const result = await axios.post(`${SEARCH_URL}`, { username, excludeList });
		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			await dispatch(GET_RANDOM_FRIEND([...result.data]));
		}
	} catch (e) {
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
	}
};

export const FollowUser = (_id, profilePicture, username, userId) => async (dispatch) => {
	await dispatch(ADD_USER_FOLLOWING({ _id, profilePicture, username }));

	try {
		const result = await axios.put(`${FOLLOW_URL}${_id}`);
		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			await dispatch(handleAlert({ ...result.data, isAlert: true }));
			// neu thanh cong
			const { user } = result.data;
			await dispatch(SET_CURRUSER_FOLLOWERS({ ...user }));
			await dispatch(REMOVE_RANDOM_FRIEND(_id)); // loai khoi random friend
			// noti
			const msg = {
				clientId: [{ _id }],
				userId,
				text: `has followed you.`,
				url: `/person/${userId}`,
			};
			socket.emit('createNotify', msg); // gui msg cho server
			socket.emit('follow', user);
		}
	} catch (e) {
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
	}
};

export const UnfollowUser = (_id, userId) => async (dispatch) => {
	await dispatch(REMOVE_USER_FOLLOWING(_id));
	try {
		const result = await axios.put(`${UNFOLLOW_URL}${_id}`);
		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			await dispatch(handleAlert({ ...result.data, isAlert: true }));

			// neu thanh cong
			const { user } = result.data;
			await dispatch(SET_CURRUSER_FOLLOWERS({ ...user }));
			// noti
			const msg = {
				clientId: [{ _id }],
				userId,
				text: `has unfollowed you.`,
				url: `/person/${userId}`,
			};
			socket.emit('createNotify', msg); // gui msg cho server
			socket.emit('unFollow', user);
		}
	} catch (e) {
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
	}
};

export const GetUser = (id) => async (dispatch) => {
	await dispatch(handleLoading(true));
	try {
		const user = await axios.post(`${USER_URL}${id}`);
		let responseOK = user && user.status === 200 && user.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			await dispatch(GET_USER({ ...user.data }));
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
