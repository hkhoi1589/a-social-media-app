import React, { memo } from 'react';
import { Link } from 'react-router-dom';

function Error() {
	return (
		<section className='page page--error flex-center'>
			<div>
				<h1>oops! it's a dead end</h1>
				<Link to='/' className='link'>
					back home
				</Link>
			</div>
		</section>
	);
}
export default memo(Error);
