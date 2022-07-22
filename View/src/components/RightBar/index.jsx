import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { ReadNoti } from '../../reducers/authReducer';
import { Link } from 'react-router-dom';
import Profile from '../Profile';
import Noti from '../Noti';
import { isEmpty } from '../../helpers';
import './index.scss';

function RightBar() {
	const { online, authUser, noti } = useSelector((state) => state.authReducer, shallowEqual);
	const { _id, username, profilePicture } = authUser;
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
		<section className='rightbar'>
			<div className='container'>
				<div className='rightbar_header flex-between-center'>
					<Profile id={_id}>
						<Profile.Img img={profilePicture} />
						<Profile.Name>{username}</Profile.Name>
					</Profile>
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
											<p className='flex-between-center'>
												<span className='long_text'>{user.username}</span>
												&nbsp;
												{text}
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
				</div>

				<article className='rightbar_info'>
					<h2>Contacts</h2>
					<ul className='rightbar_list'>
						{online.map(({ _id, profilePicture, username }, index) => (
							<li
								key={`contact-${index}`}
								className='rightbar_contact flex-between-center'>
								<Profile id={_id}>
									<Profile.Img img={profilePicture} />
									<Profile.Name>{username}</Profile.Name>
								</Profile>
								<div className='rightbar_status rightbar_status--online'></div>
							</li>
						))}
					</ul>
				</article>
			</div>
		</section>
	);
}

export default RightBar;
