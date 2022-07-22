import React, { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { GetAllPosts } from '../reducers/postReducer';
import UploadPost from '../components/UploadPost';
import RightBar from '../components/RightBar';
import NewsFeed from '../components/NewsFeed';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

function Home() {
	const { posts } = useSelector((state) => state.postReducer, shallowEqual);
	const dispatch = useDispatch();
	const [page, setPage] = useState(2);
	const [isFetching, setIsFetching] = useInfiniteScroll(GetMorePosts, page);

	async function GetMorePosts(page) {
		const result = await dispatch(GetAllPosts(page));
		if (result.length !== 0) {
			setPage(page + 1);
		} else setPage(-1);
		setIsFetching(false);
	}

	return (
		<section className='page page--home'>
			<div className='container'>
				<UploadPost />
				<NewsFeed data={posts} isFetching={isFetching} />
			</div>
			<RightBar />
		</section>
	);
}

export default Home;
