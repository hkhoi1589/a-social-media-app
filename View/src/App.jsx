import React, { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { GET_RANDOM_FRIEND, RandomFriend } from './reducers/userReducer';
import { CLEAR_POSTS, GetAllPosts } from './reducers/postReducer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import Person from './page/Person';
import Friends from './page/Friends';
import Saved from './page/Saved';
import Error from './page/Error';
import Auth from './page/Auth';
import PostId from './page/PostId';
import LeftBar from './components/LeftBar';
import Alert from './components/Alert';
import Loading from './components/Loading';
import Header from './components/Header';
import SocketClient from './SocketClient';
import './App.scss';

function App() {
	const { isLoading } = useSelector((state) => state.uiReducer, shallowEqual);
	const { isAuthenticated, authUser, following } = useSelector(
		(state) => state.authReducer,
		shallowEqual
	);
	const dispatch = useDispatch();

	useEffect(() => {
		if (isAuthenticated) {
			const excludeList = [...following.map((user) => user._id), authUser._id];
			dispatch(RandomFriend(excludeList));
		}

		return () => {
			dispatch(GET_RANDOM_FRIEND([]));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, isAuthenticated, authUser]);

	useEffect(() => {
		if (isAuthenticated) dispatch(GetAllPosts(1));

		return () => {
			dispatch(CLEAR_POSTS());
		};
	}, [dispatch, isAuthenticated, following]);

	if (!isAuthenticated) return <Auth />;

	return (
		<div className='App'>
			<Alert />
			{isLoading && <Loading />}
			{authUser && <SocketClient />}
			<BrowserRouter>
				<Header />
				<LeftBar />
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/person/:id' element={<Person />} />
					<Route path='/post/:id' element={<PostId />} />
					<Route path='/friends' element={<Friends />} />
					<Route path='/saved' element={<Saved />} />
					<Route path='*' element={<Error />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
