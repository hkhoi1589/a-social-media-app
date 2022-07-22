import React from 'react';
import './index.scss';

function SearchBar({ name, handleChangeSearch }) {
	return (
		<label htmlFor='search' className='searchbar flex-between-center'>
			<i className='fa-solid fa-magnifying-glass'></i>
			<input
				type='text'
				name='search'
				id='search'
				placeholder='Search...'
				value={name}
				onChange={(e) => handleChangeSearch(e)}
			/>
		</label>
	);
}

export default SearchBar;
