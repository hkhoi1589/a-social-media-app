import React from 'react';
import './index.scss';

function Form({ children, handleSubmit }) {
	return (
		<form action='' onSubmit={handleSubmit} className='form'>
			{children}
		</form>
	);
}

Form.UserInput = function UserInput({ handleInputChange, state }) {
	return (
		<div className='form_field'>
			<input
				type='text'
				placeholder='User Name'
				name='username'
				required
				onChange={handleInputChange}
				value={state.username}
				autoFocus={true}
			/>
		</div>
	);
};

Form.DescInput = function DescInput({ handleInputChange, state }) {
	return (
		<div className='form_field'>
			<input
				type='text'
				placeholder='Description'
				name='desc'
				onChange={handleInputChange}
				value={state.desc}
			/>
		</div>
	);
};

Form.EmailInput = function EmailInput({ handleInputChange, state }) {
	return (
		<div className='form_field' autoFocus>
			<input
				type='email'
				placeholder='Your Email'
				name='email'
				autoComplete='email'
				onChange={handleInputChange}
				value={state.email}
				required
				autoFocus={true}
				minLength='12'
				maxLength='20'
			/>
		</div>
	);
};

Form.Password = function Password({ handleInputChange, state, isLogin = false }) {
	return (
		<div className='form_field'>
			<input
				type='password'
				placeholder='Your Password'
				name='password'
				autoComplete={isLogin ? 'current-password' : 'new-password'}
				onChange={handleInputChange}
				value={state.password}
				required
				inputMode='numeric'
				minLength='6'
				maxLength='15'
			/>
		</div>
	);
};

export default Form;
