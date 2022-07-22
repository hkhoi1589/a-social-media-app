import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

function Profile({ children, id }) {
	return (
		<Link to={`/person/${id}`} className='profile flex-center'>
			{children}
		</Link>
	);
}

Profile.Img = function ProfileImg({ img, isLargeImg = false, isHugeImg = false }) {
	return (
		<div
			className={`profile_img ${isLargeImg ? 'profile_img--large' : ''} ${
				isHugeImg ? 'profile_img--huge' : ''
			}`}>
			<img src={img} alt='profile.jpg' />
		</div>
	);
};
Profile.Name = function ProfileName({ children }) {
	return <p className='profile_name long_text'>{children}</p>;
};

export default Profile;
