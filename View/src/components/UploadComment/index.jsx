import React from 'react';
import './index.scss';

function UploadComment({ children }) {
	return <article className='upload-comment flex-between-center'>{children}</article>;
}

UploadComment.Label = function CommentLabel({ children, index }) {
	return (
		<label htmlFor={`comment-${index}`} className='upload-comment_content flex-center-center'>
			{children}
		</label>
	);
};

UploadComment.Input = function CommentInput({ index, text, setText }) {
	return (
		<input
			type='text'
			id={`comment-${index}`}
			name='comment'
			value={text}
			onChange={(e) => {
				setText(e.target.value);
			}}
		/>
	);
};

UploadComment.Btn = function CommentBtn({ handleClick }) {
	return (
		<button
			type='button'
			title='comment-post'
			className='upload-comment_button'
			onClick={handleClick}>
			<i className='fa-solid fa-circle-arrow-right'></i>
		</button>
	);
};

export default UploadComment;
