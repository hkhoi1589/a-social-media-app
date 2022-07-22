import React, { useRef, useState, useEffect } from 'react';
import './index.scss';

function Noti({ isEdit = false, badge = 0, children, isNoti, setIsNoti }) {
	const [location, setLocation] = useState({});
	const container = useRef(null);
	const btnNoti = useRef(null);

	useEffect(() => {
		let submenu = container.current;
		let { center, bottom } = location;
		submenu.style.left = `${center - 150}px`;
		submenu.style.top = `${bottom + 5}px`;
	}, [location]);

	const handleNotiMouse = () => {
		let btn = btnNoti.current; // button noti
		let tempBtn = btn.getBoundingClientRect(); // lay vi tri, size cua button noti
		let { left, right, bottom } = tempBtn;
		let center = (left + right) / 2; // đảm bảo mũi tên luôn ở trung tâm button noti
		setLocation({ center, bottom });
		setIsNoti(!isNoti);
	};

	return (
		<>
			<Noti.NotiBtn
				isEdit={isEdit}
				isNoti={isNoti}
				btnNoti={btnNoti}
				handleClick={handleNotiMouse}>
				{isEdit ? (
					<i className='fa-solid fa-ellipsis'></i>
				) : (
					<>
						<i className='fa-solid fa-bell'></i>
						{badge !== 0 && (
							<p className='badge flex-center-center'>{badge > 99 ? '99+' : badge}</p>
						)}
					</>
				)}
			</Noti.NotiBtn>
			<section className={`submenu ${isNoti ? '' : 'hide'}`}>
				<div
					className='background'
					onClick={() => {
						setIsNoti(!isNoti);
					}}></div>
				<div ref={container} className={`submenu_container`}>
					<ul>{children}</ul>
				</div>
			</section>
		</>
	);
}

Noti.NotiBtn = function NotiBtn({
	isEdit = false,
	children,
	isNoti = false,
	btnNoti = null,
	handleClick,
}) {
	return (
		<button
			type='button'
			ref={btnNoti}
			title='noti-post'
			className={`noti flex-center-center ${isEdit ? 'noti--edit' : ''} ${
				isNoti ? 'noti_clicked' : ''
			}`}
			onMouseDown={handleClick}>
			{children}
		</button>
	);
};

Noti.NotiLink = function NotiLink({ isEdit = false, children, handleClick }) {
	return (
		<button
			type='button'
			title='noti-btn'
			className='btn link submenu_link'
			onClick={handleClick}>
			<div className={`submenu_content ${isEdit ? 'submenu_content--edit' : ''}`}>
				<p>{children}</p>
			</div>
		</button>
	);
};

export default Noti;
