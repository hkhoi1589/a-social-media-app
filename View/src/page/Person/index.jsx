import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { GetUser, CLEAR_USER } from '../../reducers/userReducer';
import { GetUserPosts, CLEAR_USER_POSTS, SET_USER_POSTS } from '../../reducers/postReducer';
import { Link, useParams } from 'react-router-dom';
import PersonHeader from '../../components/PersonHeader';
import NewsFeed from '../../components/NewsFeed';
import UploadPost from '../../components/UploadPost';
import Loading from '../../components/Loading';
import Card from '../../components/Card';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { isEmpty } from '../../helpers';
import './index.scss';
import Modal from '../../components/Modal';

function Person() {
	const id = useParams().id;
	const { authUser, following } = useSelector((state) => state.authReducer, shallowEqual);
	const { userPosts, posts } = useSelector((state) => state.postReducer, shallowEqual);
	const { currUser, userFollowing, userFollowers } = useSelector(
		(state) => state.userReducer,
		shallowEqual
	);
	let { username, coverPicture, profilePicture, desc } = currUser;
	const dispatch = useDispatch();

	const [page, setPage] = useState(2);
	const [isFollowingShow, setFollowingShow] = useState(false);
	const [isFollowerShow, setFollowerShow] = useState(false);
	const [isFetching, setIsFetching] = useInfiniteScroll(GetMoreUserPosts, page);

	const handleFollowingShow = () => {
		setFollowingShow(!isFollowingShow);
	};

	const handleFollowerShow = () => {
		setFollowerShow(!isFollowerShow);
	};

	async function GetMoreUserPosts(page) {
		const result = await dispatch(GetUserPosts(id, page));
		if (result.length !== 0) {
			setPage(page + 1);
		} else setPage(-1);
		setIsFetching(false);
	}

	useEffect(() => {
		dispatch(GetUser(id));
		return () => {
			setPage(2);
			dispatch(CLEAR_USER());
		};
	}, [dispatch, id]);

	useEffect(() => {
		async function FirstLoad() {
			const result = await dispatch(GetUserPosts(id, 1));
			dispatch(SET_USER_POSTS(result));
		}
		FirstLoad();
		return () => {
			setPage(2);
			dispatch(CLEAR_USER_POSTS());
		};
	}, [dispatch, id, posts]);

	if (isEmpty(authUser) || !userPosts) return <Loading />;

	return (
		<>
			<section className='page page--other person'>
				<div className='person_container'>
					<PersonHeader
						id={id}
						username={username}
						coverPicture={coverPicture}
						profilePicture={profilePicture}
						desc={desc}
						authUser={authUser}
						isUnfollowed={following.some((f) => f._id === id)}
					/>
					<div className='person_content'>
						<div className='person_posts'>
							{authUser._id !== id ? '' : <UploadPost />}
							<NewsFeed data={userPosts} isFetching={isFetching} />
						</div>
						<div className='person_friends'>
							<article className='person_friend'>
								<button type='button' onClick={handleFollowingShow}>
									<h4>{`Following (${userFollowing.length})`}</h4>
								</button>
								{userFollowing && (
									<section className='list person_list'>
										{userFollowing
											.slice(0, 4)
											.map(({ _id, profilePicture, username }, index) => (
												<Link
													to={`/person/${_id}`}
													key={`following-${index}`}>
													<Card
														isList={true}
														img={profilePicture}
														subContent={username}
													/>
												</Link>
											))}
									</section>
								)}
							</article>
							<article className='person_friend'>
								<button type='button' onClick={handleFollowerShow}>
									<h4>{`Followers (${userFollowers.length})`}</h4>
								</button>
								{userFollowers && (
									<section className='list person_list'>
										{userFollowers
											.slice(0, 4)
											.map(({ _id, profilePicture, username }, index) => (
												<Link
													to={`/person/${_id}`}
													key={`follower-${index}`}>
													<Card
														isList={true}
														img={profilePicture}
														subContent={username}
													/>
												</Link>
											))}
									</section>
								)}
							</article>
						</div>
					</div>
				</div>
			</section>
			<Modal isShow={isFollowingShow} handleShow={handleFollowingShow}>
				<Modal.Header>Followings</Modal.Header>
				<div className='container'>
					{!isEmpty(userFollowing) ? (
						<section className='list person_list modal_content'>
							{userFollowing.map(({ _id, profilePicture, username }, index) => (
								<Link to={`/person/${_id}`} key={`following-${index}`}>
									<Card
										isList={true}
										img={profilePicture}
										subContent={username}
									/>
								</Link>
							))}
						</section>
					) : (
						'No Followings'
					)}
				</div>
			</Modal>

			<Modal isShow={isFollowerShow} handleShow={handleFollowerShow}>
				<Modal.Header>Followers</Modal.Header>
				<div className='container'>
					{!isEmpty(userFollowers) ? (
						<section className='list person_list modal_content'>
							{userFollowers.map(({ _id, profilePicture, username }, index) => (
								<Link to={`/person/${_id}`} key={`following-${index}`}>
									<Card
										isList={true}
										img={profilePicture}
										subContent={username}
									/>
								</Link>
							))}
						</section>
					) : (
						'No Followers'
					)}
				</div>
			</Modal>
		</>
	);
}

export default Person;
