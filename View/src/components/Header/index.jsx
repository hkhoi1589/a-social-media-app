import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ReadNoti, Logout } from '../../reducers/authReducer';
import { Link, useLocation } from 'react-router-dom';
import LeftBar from '../LeftBar';
import Noti from '../Noti';
import Profile from '../Profile';
import { isEmpty } from '../../helpers';
import './index.scss';

function Header() {
	const currentPath = useLocation().pathname;
	const { noti } = useSelector((state) => state.authReducer, shallowEqual);
	const dispatch = useDispatch();

	const [isNoti, setIsNoti] = useState(false);
	const [badge, setBadge] = useState(0);

	useEffect(() => {
		if (!isNoti) {
			setBadge(
				noti.reduce((previousCount, currentItem) => {
					if (!currentItem.isRead) {
						previousCount += 1;
					}
					return previousCount;
				}, 0)
			);
		} else {
			setBadge(0);
			dispatch(ReadNoti());
		}
	}, [dispatch, noti, isNoti]);
	return (
		<section className='header'>
			<article className='header_brand flex-between-center'>
				<LeftBar.Header />
				<div className='flex-between-center'>
					<Noti isNoti={isNoti} setIsNoti={setIsNoti} badge={badge}>
						{!isEmpty(noti) ? (
							noti.map(({ user, text, url, isRead }, index) => (
								<li key={`noti-${index}`}>
									<Link
										to={url}
										className={`link submenu_link ${
											!isRead ? 'submenu_link--read' : ''
										}`}>
										<Profile.Img img={user.profilePicture} isLargeImg={true} />
										<div
											className={`submenu_content ${
												!isRead ? 'submenu_content--read' : ''
											}`}>
											<p>
												<span>{user.username}</span> {text}
											</p>
										</div>
									</Link>
								</li>
							))
						) : (
							<li className='submenu_content'>
								<p>No notifications</p>
							</li>
						)}
					</Noti>
					<Noti.NotiBtn
						handleClick={() => {
							dispatch(Logout());
						}}>
						<i className='fa-solid fa-right-from-bracket'></i>
					</Noti.NotiBtn>
				</div>
			</article>
			<nav className='header_tabs'>
				<div className='header_tab'>
					<Link
						to='/'
						className={`header_link ${
							currentPath === '/' ? 'header_link--active' : ''
						} link`}>
						<i className='fa-solid fa-house'></i>
						<p>Home</p>
					</Link>
				</div>
				<div className='header_tab'>
					<Link
						to='/friends'
						className={`header_link ${
							currentPath === '/friends' ? 'header_link--active' : ''
						} link`}>
						<i className='fa-solid fa-user'></i>
						<p>Friends</p>
					</Link>
				</div>
				<div className='header_tab'>
					<Link
						to='/saved'
						className={`header_link ${
							currentPath === '/saved' ? 'header_link--active' : ''
						} link`}>
						<i className='fa-solid fa-floppy-disk'></i>
						<p>Saved</p>
					</Link>
				</div>
			</nav>
		</section>
	);
}

export default Header;
