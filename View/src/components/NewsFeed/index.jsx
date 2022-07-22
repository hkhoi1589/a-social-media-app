import React from 'react';
import Post from '../Post';
import gif from './Bars-1s-200px.svg';
import './index.scss';

function NewsFeed({ data, isFetching }) {
	return (
		<section className='newsfeed'>
			<ul>
				{data.map(({ _id, author, text, comments, likers, file }, index) => (
					<li key={index}>
						<Post
							_id={_id}
							authorId={author._id}
							profilePicture={author.profilePicture}
							username={author.username}
							index={index}
							content={text}
							image={file}
							heart={likers}
							comments={comments}
						/>
					</li>
				))}
			</ul>
			{isFetching && <img src={gif} alt='loadingPosts.svg' />}
		</section>
	);
}

export default NewsFeed;
