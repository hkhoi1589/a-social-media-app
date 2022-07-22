import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { API_URL } from './API';
import { ADD_USER_NOTI, ADD_USER_ONLINE, REMOVE_USER_ONLINE } from './reducers/authReducer';
import { ADD_COMMENT, DELETE_COMMENT, UPDATE_POST_LIKES } from './reducers/postReducer';
import { SET_CURRUSER_FOLLOWERS } from './reducers/userReducer';

export const socket = io(API_URL, { transports: ['websocket'], upgrade: false }); // only websocket

const SocketClient = () => {
	const { authUser, following, followers, online } = useSelector((state) => state.authReducer);
	const dispatch = useDispatch();

	// joinUser
	useEffect(() => {
		socket.emit('joinUser', { ...authUser, following, followers });
		return () => socket.off('joinUser');
	}, [authUser, following, followers]);

	// Likes
	useEffect(() => {
		socket.on('likeToClient', async (newPost) => {
			await dispatch(UPDATE_POST_LIKES(newPost));
		});

		return () => socket.off('likeToClient');
	}, [dispatch]);

	useEffect(() => {
		socket.on('unLikeToClient', async (newPost) => {
			await dispatch(UPDATE_POST_LIKES(newPost));
		});

		return () => socket.off('unLikeToClient');
	}, [dispatch]);

	// Comments
	useEffect(() => {
		socket.on('createCommentToClient', async (newPost) => {
			await dispatch(ADD_COMMENT(newPost));
		});

		return () => socket.off('createCommentToClient');
	}, [dispatch]);

	useEffect(() => {
		socket.on('deleteCommentToClient', async (newPost) => {
			await dispatch(DELETE_COMMENT(newPost));
		});

		return () => socket.off('deleteCommentToClient');
	}, [dispatch]);

	// Follow
	useEffect(() => {
		socket.on('followToClient', async (newUser) => {
			await dispatch(SET_CURRUSER_FOLLOWERS(newUser)); // cap nhat lai followers
		});

		return () => socket.off('followToClient');
	}, [dispatch]);

	useEffect(() => {
		socket.on('unFollowToClient', async (newUser) => {
			await dispatch(SET_CURRUSER_FOLLOWERS(newUser)); // cap nhat lai followers
		});

		return () => socket.off('unFollowToClient');
	}, [dispatch]);

	// Notification
	useEffect(() => {
		socket.on('createNotifyToClient', async (msg) => {
			await dispatch(ADD_USER_NOTI(msg));
		});

		return () => socket.off('createNotifyToClient');
	}, [dispatch]);

	// Check User Online / Offline
	useEffect(() => {
		socket.emit('checkUserOnline', { ...authUser, following, followers });

		return () => socket.off('checkUserOnline');
	}, [authUser, following, followers]);

	useEffect(() => {
		socket.on('checkUserOnlineToMe', (data) => {
			if (data) {
				data.forEach(async (item) => {
					if (online.every((user) => user._id !== item._id)) {
						await dispatch(ADD_USER_ONLINE(item));
					}
				});
			}
		});

		return () => socket.off('checkUserOnlineToMe');
	}, [dispatch, online]);

	useEffect(() => {
		socket.on('checkUserOnlineToClient', async (msg) => {
			if (online.every((user) => user._id !== msg._id)) {
				await dispatch(ADD_USER_ONLINE(msg));
			}
		});

		return () => socket.off('checkUserOnlineToClient');
	}, [dispatch, online]);

	// Check User Offline
	useEffect(() => {
		socket.on('CheckUserOffline', async (id) => {
			await dispatch(REMOVE_USER_ONLINE(id));
		});

		return () => socket.off('CheckUserOffline');
	}, [dispatch]);
};

export default SocketClient;
