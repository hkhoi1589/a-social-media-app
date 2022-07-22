import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Card from '../components/Card';

function Saved() {
	const { saved } = useSelector((state) => state.authReducer, shallowEqual);

	return (
		<section className='page page--other'>
			<section className='list '>
				{saved.map(({ _id, author, text, file }, index) => (
					<Card
						key={`saved-${index}`}
						id={_id}
						mainContent={text}
						subContent={author.username}
						img={
							file
								? file
								: 'https://res.cloudinary.com/dlvk5v5jr/image/upload/v1656904678/noimage_food_viet247_r3nlzm.jpg'
						}
					/>
				))}
			</section>
		</section>
	);
}

export default Saved;
