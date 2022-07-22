import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

function Card({ id, mainContent, subContent, isPerson = false, isList = false, img, handleClick }) {
	return (
		<article className={`card flex-column-between ${isList ? 'card--list' : ''}`}>
			<img src={img} alt='' />
			{isList ? (
				<div className='container'>
					<div className='card_info'>
						<p className='long_text'>{subContent}</p>
					</div>
				</div>
			) : isPerson ? (
				<div className='container'>
					<div className='card_info'>
						<Link to={`/person/${id}`}>
							<h2 className='long_text'>{mainContent}</h2>
						</Link>
						<p className='long_text'>{subContent}</p>
					</div>
					<button
						type='button'
						className='btn card_button card_button--red'
						onClick={handleClick}>
						<i className='fa-solid fa-user-plus'></i>
						<p>Follow</p>
					</button>
				</div>
			) : (
				<div className='container'>
					<div className='card_info'>
						<h2 className='long_text'>{mainContent}</h2>
						<p className='long_text'>
							<span>{'by '}</span>
							{subContent}
						</p>
					</div>
					<Link to={`/post/${id}`}>
						<button type='button' className='btn card_button card_button--red'>
							<i className='fa-solid fa-arrow-right-from-bracket'></i>
							<p>See post</p>
						</button>
					</Link>
				</div>
			)}
		</article>
	);
}

export default memo(Card);
