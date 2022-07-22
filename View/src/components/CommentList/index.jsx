import React from 'react';
import Comment from '../Comment';

function CommentList({ comments, postId }) {
	return (
		<ul className='comment-list'>
			{comments.map(({ _id, user, text }, index) => (
				<li key={`comment-${index}`}>
					<Comment _id={_id} user={user} text={text} postId={postId} index={index} />
				</li>
			))}
		</ul>
	);
}

export default CommentList;
