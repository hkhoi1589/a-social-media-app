import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { handleAlert } from '../../reducers/uiReducer';
import './index.scss';

function Alert() {
	const { isAlert, type, message } = useSelector((state) => state.uiReducer);
	const dispatch = useDispatch();

	// cứ mỗi lần có message mới
	useEffect(() => {
		if (!isAlert) return;
		// và tắt alert
		const timeId = setInterval(async () => {
			await dispatch(handleAlert({ isAlert: false, type: '', message: '' }));
		}, 4000);

		// cleanup
		return () => {
			clearInterval(timeId);
		};
	}, [dispatch, isAlert, message]);

	return (
		<article className={`alert alert--${type} ${!isAlert ? 'hide' : ''}`}>{message}</article>
	);
}

export default Alert;
