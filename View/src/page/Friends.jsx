import React, { useState, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { SearchFriend, FollowUser } from '../reducers/userReducer';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import { isEmpty } from '../helpers';

function Friends() {
	const { randomFriend } = useSelector((state) => state.userReducer, shallowEqual);
	const { authUser, following } = useSelector((state) => state.authReducer, shallowEqual);
	const dispatch = useDispatch();

	const [name, setName] = useState('');
	const timeoutRef = useRef(null);

	const handleChangeSearch = (e) => {
		const excludeList = [...following.map((user) => user._id), authUser._id];
		const value = e.target.value;
		setName(value);

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(async () => {
			await dispatch(SearchFriend(value, excludeList));
		}, 1000);
	};

	const handleFollowById = async (_id, profilePicture, username) => {
		await dispatch(FollowUser(_id, profilePicture, username, authUser._id));
	};

	if (isEmpty(authUser) || !randomFriend) return <Loading />;

	return (
		<section className='page page--other'>
			<SearchBar name={name} handleChangeSearch={handleChangeSearch} />
			<section className='list'>
				{randomFriend.map(({ _id, profilePicture, username, followers }, index) => (
					<Card
						key={`friend-${index}`}
						id={_id}
						mainContent={username}
						subContent={`${followers.length} ${
							followers.length > 1 ? 'followers' : 'follower'
						}`}
						isPerson={true}
						img={profilePicture}
						handleClick={() => handleFollowById(_id, profilePicture, username)}
					/>
				))}
			</section>
		</section>
	);
}

export default Friends;
