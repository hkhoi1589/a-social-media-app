import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { GetPost, GET_POST_ID } from '../reducers/postReducer';
import { useParams } from 'react-router-dom';
import RightBar from '../components/RightBar';
import Post from '../components/Post';
import Loading from '../components/Loading';
import { isEmpty } from '../helpers';

function PostId() {
	const id = useParams().id;
	const { currPost } = useSelector((state) => state.postReducer, shallowEqual);
	const { authUser } = useSelector((state) => state.authReducer, shallowEqual);
	const { _id, author, text, comments, likers, file } = currPost;
	const dispatch = useDispatch();

	useEffect(() => {
		async function FirstLoad(id) {
			await dispatch(GetPost(id));
		}
		FirstLoad(id);
		return async () => await dispatch(GET_POST_ID({}));
	}, [dispatch, id]);

	if (isEmpty(authUser) || !currPost) return <Loading />;

	return (
		<>
			<section className='page page--home'>
				<div className='container'>
					{!isEmpty(currPost) ? (
						<Post
							_id={_id}
							authorId={author._id}
							profilePicture={author.profilePicture}
							username={author.username}
							index={0}
							content={text}
							image={file}
							heart={likers}
							comments={comments}
						/>
					) : (
						''
					)}
				</div>
			</section>
			{window.innerWidth > 780 && <RightBar />}
		</>
	);
}

export default PostId;
