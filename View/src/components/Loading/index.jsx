import React from 'react';
import svg from './Double Ring-1s-200px.svg';
import './index.scss';

const Loading = () => {
	return (
		<article className='loading flex-center-center'>
			<img src={svg} alt='loading.svg' />
		</article>
	);
};

export default Loading;
