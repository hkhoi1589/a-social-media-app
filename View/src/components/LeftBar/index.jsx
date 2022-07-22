import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Logout } from '../../reducers/authReducer';
import { Link, useLocation } from 'react-router-dom';
import logo from './logo_fxlm9g.jpg';
import Card from '../Card';
import './index.scss';

function LeftBar() {
	const { posts } = useSelector((state) => state.postReducer, shallowEqual);
	const currentPath = useLocation().pathname;
	const dispatch = useDispatch();

	return (
		<aside className='leftbar'>
			<div className='leftbar_container'>
				<LeftBar.Header />

				<article className='leftbar_menu'>
					<h2 className='leftbar_title'>Menu</h2>
					<ul className='leftbar_list'>
						<li>
							<Link
								to='/'
								className={`leftbar_link ${
									currentPath === '/' ? 'leftbar_link--active' : ''
								} link`}>
								<i className='fa-solid fa-house'></i>
								<p>Home</p>
							</Link>
						</li>
						<li>
							<Link
								to='/friends'
								className={`leftbar_link ${
									currentPath === '/friends' ? 'leftbar_link--active' : ''
								} link`}>
								<i className='fa-solid fa-user'></i>
								<p>Friends</p>
							</Link>
						</li>
						<li>
							<Link
								to='/saved'
								className={`leftbar_link ${
									currentPath === '/saved' ? 'leftbar_link--active' : ''
								} link`}>
								<i className='fa-solid fa-floppy-disk'></i>
								<p>Saved</p>
							</Link>
						</li>
						<li
							onClick={() => {
								dispatch(Logout());
							}}>
							<Link to='/' className='leftbar_link link'>
								<i className='fa-solid fa-right-from-bracket'></i>
								<p>Logout</p>
							</Link>
						</li>
					</ul>
				</article>
				<article className='leftbar_post'>
					<h2>Latest Post</h2>

					{posts && posts.length > 0 && (
						<Card
							id={posts[0]._id}
							mainContent={posts[0].text}
							subContent={posts[0].author.username}
							img={
								posts[0].file
									? posts[0].file
									: 'https://res.cloudinary.com/dlvk5v5jr/image/upload/v1656904678/noimage_food_viet247_r3nlzm.jpg'
							}
						/>
					)}
				</article>
			</div>
		</aside>
	);
}

LeftBar.Header = function LeftHeader() {
	return (
		<div className='leftbar_header flex-between-center'>
			<Link to='/' className='leftbar_brand flex-center'>
				<img src={logo} alt='logo.png' srcSet='' />
				<p>Cofeed</p>
			</Link>
		</div>
	);
};

export default LeftBar;
