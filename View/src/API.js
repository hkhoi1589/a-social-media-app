const API_URL = 'https://a-social-media-app.herokuapp.com';

// For login and register
const LOGIN_URL = `${API_URL}/api/auth/login`;
const REGISTER_URL = `${API_URL}/api/auth/register`;

// For user
const USER_URL = `${API_URL}/api/user/`;
const SEARCH_URL = `${API_URL}/api/user/search`;
const FOLLOW_URL = `${API_URL}/api/user/follow/`;
const UNFOLLOW_URL = `${API_URL}/api/user/unfollow/`;

// For post
const POST_URL = `${API_URL}/api/post/`;
const GET_ALL_POST_URL = `${API_URL}/api/post/page/`;
const CREATE_POST_URL = `${API_URL}/api/post/create/`;
const SAVE_POST_URL = `${API_URL}/api/post/save/`;
const UNSAVE_POST_URL = `${API_URL}/api/post/unsave/`;

export {
	API_URL,
	LOGIN_URL,
	REGISTER_URL,
	USER_URL,
	SEARCH_URL,
	FOLLOW_URL,
	UNFOLLOW_URL,
	POST_URL,
	GET_ALL_POST_URL,
	CREATE_POST_URL,
	SAVE_POST_URL,
	UNSAVE_POST_URL,
};
