import axios from 'axios';

// tự động set token vào header khi xài axios
const setAuthToken = (token) => {
	if (token) {
		axios.defaults.headers.common['Authorization'] = token;
	} else {
		delete axios.defaults.headers.common['Authorization'];
	}
};

export default setAuthToken;
