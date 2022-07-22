import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {
	CREATE_POST_URL,
	GET_ALL_POST_URL,
	POST_URL,
	SAVE_POST_URL,
	UNSAVE_POST_URL,
} from '../API';
import { handleLoading, handleAlert } from './uiReducer';
import { SET_USER_SAVE } from './authReducer';
import { isEmpty } from '../helpers';
import { socket } from '../SocketClient';

let homePage = 0,
	userPage = 0;

export const postReducer = createSlice({
	name: 'post',
	initialState: {
		posts: [],
		currPost: {},
		userPosts: [],
	},
	reducers: {
		ADD_COMMENT: (state, action) => {
			return {
				...state,
				posts: state.posts.map((post) => {
					if (post._id === action.payload._id) {
						return {
							...post,
							comments: action.payload.comments,
						};
					}
					return post;
				}),
				currPost: !isEmpty(state.currPost)
					? {
							...state.currPost,
							comments: action.payload.comments,
					  }
					: state.currPost,
			};
		},
		DELETE_COMMENT: (state, action) => {
			return {
				...state,
				posts: state.posts.map((post) => {
					if (post._id === action.payload._id) {
						return {
							...post,
							comments: post.comments.filter(
								({ _id }) => _id !== action.payload.commentId
							),
						};
					}
					return post;
				}),
				currPost: !isEmpty(state.currPost)
					? {
							...state.currPost,
							comments: state.currPost.comments.filter(
								({ _id }) => _id !== action.payload.commentId
							),
					  }
					: state.currPost,
			};
		},

		EDIT_COMMENT: (state, action) => {
			return {
				...state,
				posts: state.posts.map((post) => {
					if (post._id === action.payload._id) {
						return {
							...post,
							comments: action.payload.comments,
						};
					}
					return post;
				}),
				currPost: !isEmpty(state.currPost)
					? {
							...state.currPost,
							comments: action.payload.comments,
					  }
					: state.currPost,
			};
		},
		ADD_POSTS: (state, action) => {
			return {
				...state,
				posts: state.posts.concat(action.payload), // ghep posts cu va posts moi
			};
		},
		CLEAR_POSTS: (state) => {
			homePage = 0;
			return {
				...state,
				posts: [],
			};
		},

		GET_POST_ID: (state, action) => {
			return {
				...state,
				currPost: action.payload,
			};
		},
		SET_USER_POSTS: (state, action) => {
			return {
				...state,
				userPosts: action.payload,
			};
		},
		ADD_USER_POSTS: (state, action) => {
			return {
				...state,
				userPosts: state.userPosts.concat(action.payload),
			};
		},
		CLEAR_USER_POSTS: (state) => {
			userPage = 0;
			return {
				...state,
				userPosts: [],
			};
		},
		CREATE_POST: (state, action) => {
			return {
				...state,
				posts: [
					{
						_id: action.payload._id,
						author: action.payload.author,
						comments: [],
						likers: [],
						text: action.payload.text,
						file: action.payload.file,
					},
					...state.posts,
				],
			};
		},
		EDIT_POST: (state, action) => {
			return {
				...state,
				posts: state.posts.map((post) => {
					if (post._id === action.payload._id) {
						return {
							...post,
							text: action.payload.text,
							file: action.payload.file,
						};
					}
					return post;
				}),
			};
		},
		UPDATE_POST_LIKES: (state, action) => {
			return {
				...state,
				posts: state.posts.map((post) => {
					if (post._id === action.payload._id) {
						return {
							...post,
							likers: action.payload.likers,
						};
					}
					return post;
				}),
				currPost: !isEmpty(state.currPost)
					? {
							...state.currPost,
							likers: action.payload.likers,
					  }
					: state.currPost,
			};
		},
		DELETE_POST: (state, action) => {
			return {
				...state,
				posts: state.posts.filter(({ _id }) => _id !== action.payload),
				currPost: {},
			};
		},
	},
});

export const {
	ADD_COMMENT,
	DELETE_COMMENT,
	EDIT_COMMENT,
	ADD_POSTS,
	CLEAR_POSTS,
	GET_POST_ID,
	SET_USER_POSTS,
	ADD_USER_POSTS,
	CLEAR_USER_POSTS,
	CREATE_POST,
	EDIT_POST,
	UPDATE_POST_LIKES,
	DELETE_POST,
} = postReducer.actions;

export default postReducer.reducer;

export const GetAllPosts = (page) => async (dispatch) => {
	try {
		if (page > homePage) {
			homePage = page;
			const postsResult = await axios.get(`${GET_ALL_POST_URL}${page}`);
			let responseOK =
				postsResult && postsResult.status === 200 && postsResult.statusText === 'OK';
			if (responseOK) {
				// neu thanh cong
				await dispatch(ADD_POSTS([...postsResult.data]));
				return postsResult.data;
			}
		}
		return [];
	} catch (e) {
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
	}
};

export const GetUserPosts = (authorId, page) => async (dispatch) => {
	try {
		if (page > userPage) {
			userPage = page;
			const userPostsResult = await axios.get(`${POST_URL}${authorId}/page/${page}`);
			let responseOK =
				userPostsResult &&
				userPostsResult.status === 200 &&
				userPostsResult.statusText === 'OK';
			if (responseOK) {
				// neu thanh cong
				await dispatch(ADD_USER_POSTS(userPostsResult.data));
				return userPostsResult.data;
			}
		}
		return [];
	} catch (e) {
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
	}
};

export const CreatePost = (text, file, followers) => async (dispatch) => {
	try {
		const bodyData = {
			text,
			file,
		};
		const result = await axios.post(CREATE_POST_URL, bodyData);
		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			const { newPost } = result.data;
			// noti
			const msg = {
				clientId: followers,
				userId: newPost.author._id,
				text: `has created a new post.`,
				url: `/post/${newPost._id}`,
			};
			socket.emit('createNotify', msg); // gui msg cho server
			await dispatch(CREATE_POST(newPost));
			await dispatch(handleLoading(false));
			await dispatch(handleAlert({ ...result.data, isAlert: true }));
		}
	} catch (e) {
		await dispatch(handleLoading(false));
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
		window.location.href = '/';
	}
};

export const GetPost = (id) => async (dispatch) => {
	await dispatch(handleLoading(true));
	try {
		const post = await axios.get(`${POST_URL}${id}`);
		let responseOK = post && post.status === 200 && post.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			await dispatch(GET_POST_ID({ ...post.data }));
			await dispatch(handleLoading(false));
		}
	} catch (e) {
		await dispatch(handleLoading(false));
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
		window.location.href = '/';
	}
};

export const EditPost = (id, text, file) => async (dispatch) => {
	try {
		const bodyData = { file, text };
		const result = await axios.put(`${POST_URL}${id}`, bodyData);
		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			const { post } = result.data;
			await dispatch(EDIT_POST(post));
			await dispatch(handleLoading(false));
			await dispatch(handleAlert({ ...result.data, isAlert: true }));
		}
	} catch (e) {
		await dispatch(handleLoading(false));
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
		window.location.href = '/';
	}
};

export const RemovePost = (id) => async (dispatch) => {
	await dispatch(handleLoading(true));
	try {
		const result = await axios.delete(`${POST_URL}${id}`);
		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			const { user } = result.data;
			await Promise.all([dispatch(DELETE_POST(id)), dispatch(SET_USER_SAVE(user))]);
			await dispatch(handleLoading(false));
			await dispatch(handleAlert({ ...result.data, isAlert: true }));
		}
	} catch (e) {
		await dispatch(handleLoading(false));
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
		window.location.href = '/';
	}
};

export const LikePost = (userId, id) => async (dispatch) => {
	try {
		const bodyData = { action: 'like', userId };
		const result = await axios.put(`${POST_URL}${id}`, bodyData);
		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			socket.emit('likePost', result.data);
			await dispatch(UPDATE_POST_LIKES({ ...result.data }));
			await dispatch(handleAlert({ ...result.data, isAlert: true }));
		}
	} catch (e) {
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
	}
};

export const DislikePost = (userId, id) => async (dispatch) => {
	try {
		const bodyData = { action: 'dislike', userId };
		const result = await axios.put(`${POST_URL}${id}`, bodyData);
		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			socket.emit('unLikePost', result.data);
			await dispatch(UPDATE_POST_LIKES({ ...result.data }));
			await dispatch(handleAlert({ ...result.data, isAlert: true }));
		}
	} catch (e) {
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
	}
};

export const AddComment = (user, id, text) => async (dispatch) => {
	await dispatch(handleLoading(true));
	try {
		const bodyData = { action: 'addComment', user, text };
		const cmt = await axios.put(`${POST_URL}${id}`, bodyData);
		let responseOK = cmt && cmt.status === 200 && cmt.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			socket.emit('createComment', cmt.data);
			await dispatch(ADD_COMMENT({ ...cmt.data }));
			await dispatch(handleLoading(false));
			await dispatch(handleAlert({ ...cmt.data, isAlert: true }));
		}
	} catch (e) {
		await dispatch(handleLoading(false));
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
		window.location.href = '/';
	}
};

export const EditComment = (commentId, id, text) => async (dispatch) => {
	await dispatch(handleLoading(true));
	try {
		const bodyData = { action: 'editComment', commentId, text };
		const result = await axios.put(`${POST_URL}${id}`, bodyData);
		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			const { post } = result.data;
			await dispatch(EDIT_COMMENT(post));
			await dispatch(handleLoading(false));
			await dispatch(handleAlert({ ...result.data, isAlert: true }));
		}
	} catch (e) {
		await dispatch(handleLoading(false));
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
		window.location.href = '/';
	}
};

export const RemoveComment = (commentId, id) => async (dispatch) => {
	await dispatch(handleLoading(true));
	try {
		const bodyData = { action: 'deleteComment', commentId };
		const result = await axios.put(`${POST_URL}${id}`, bodyData);
		let responseOK = result && result.status === 200 && result.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			const { deletedCmt } = result.data;
			socket.emit('deleteComment', deletedCmt);
			await dispatch(DELETE_COMMENT(deletedCmt));
			await dispatch(handleLoading(false));
			await dispatch(handleAlert({ ...result.data, isAlert: true }));
		}
	} catch (e) {
		await dispatch(handleLoading(false));
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
		window.location.href = '/';
	}
};

export const SavePost = (id, userId) => async (dispatch) => {
	try {
		const bodyData = {
			userId,
		};
		const saveResult = await axios.put(`${SAVE_POST_URL}${id}`, bodyData);
		let responseOK = saveResult && saveResult.status === 200 && saveResult.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			const { user } = saveResult.data;
			await dispatch(SET_USER_SAVE(user));
			await dispatch(handleAlert({ ...saveResult.data, isAlert: true }));
		}
	} catch (e) {
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
	}
};

export const UnsavePost = (id, userId) => async (dispatch) => {
	try {
		const bodyData = {
			userId,
		};
		const unsaveResult = await axios.put(`${UNSAVE_POST_URL}${id}`, bodyData);
		let responseOK =
			unsaveResult && unsaveResult.status === 200 && unsaveResult.statusText === 'OK';
		if (responseOK) {
			// neu thanh cong
			const { user } = unsaveResult.data;
			await dispatch(SET_USER_SAVE(user));
			await dispatch(handleAlert({ ...unsaveResult.data, isAlert: true }));
		}
	} catch (e) {
		await dispatch(handleAlert({ ...e.response.data, isAlert: true }));
	}
};
