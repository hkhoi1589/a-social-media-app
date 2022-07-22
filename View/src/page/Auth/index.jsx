import React, { useState, useEffect } from 'react';
import './index.scss';
import jwt_decode from 'jwt-decode';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Login, Register, Logout } from '../../reducers/authReducer';
import { GetAuthUser } from '../../reducers/authReducer';
import setAuthToken from '../../setAuthToken';
import { handleLoading } from '../../reducers/uiReducer';
import Form from '../../components/Form';
import Loading from '../../components/Loading';
import Alert from '../../components/Alert';

function Auth() {
	const { isLoading } = useSelector((state) => state.uiReducer, shallowEqual);
	const dispatch = useDispatch();
	const [isSignUp, setIsSignUp] = useState(false);
	const [state, setState] = useState({
		username: '',
		email: '',
		password: '',
	});

	// kiem tra neu da tung login moi lan vao page
	useEffect(() => {
		async function checkLogin() {
			await dispatch(handleLoading(true));
			const jwtToken = localStorage.getItem('token');

			if (jwtToken) {
				setAuthToken(jwtToken); // mac dinh header axios la token
				const decoded = jwt_decode(jwtToken);
				await dispatch(GetAuthUser(decoded.id));
				// kiem tra het han
				const currentTime = Date.now() / 1000;
				if (decoded.exp < currentTime) {
					await dispatch(Logout());
				}
			}
			await dispatch(handleLoading(false));
		}
		checkLogin();
	}, [dispatch]);

	const handleLoginClick = () => {
		setIsSignUp(false);
	};
	const handleSignUpClick = () => {
		setIsSignUp(true);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setState({ ...state, [name]: value });
	};

	const handleSubmitLogin = async (e) => {
		e.preventDefault();
		const { email, password } = state;
		await dispatch(Login(email, password));
	};

	const handleSubmitRegister = async (e) => {
		e.preventDefault();
		const { username, email, password } = state;
		await dispatch(Register(username, email, password));
	};
	return (
		<section className='auth'>
			<Alert />
			{isLoading && <Loading />}
			<section className='auth_container flex-center-center'>
				<div className='auth_forms'>
					<article className={`auth_login ${isSignUp ? 'hide' : ''}`}>
						<h2 className='form_title'>Login</h2>
						<Form handleSubmit={(e) => handleSubmitLogin(e)}>
							<fieldset>
								<Form.EmailInput
									handleInputChange={(e) => handleInputChange(e)}
									state={state}
								/>
								<Form.Password
									handleInputChange={(e) => handleInputChange(e)}
									state={state}
									isLogin={true}
								/>
							</fieldset>

							<div className='form_footer flex-column-between'>
								<input
									type='submit'
									value='Log in'
									name='login'
									className='form_submit'
								/>
							</div>

							<p className='form_message'>
								Not registered?{' '}
								<button
									type='button'
									className='form_button'
									onClick={() => handleSignUpClick()}>
									Create an account
								</button>
							</p>
						</Form>
					</article>
					<article className={`auth_signup ${isSignUp ? '' : 'hide'}`}>
						<h2 className='form_title'>Sign up</h2>
						<Form handleSubmit={handleSubmitRegister}>
							<fieldset>
								<Form.UserInput
									handleInputChange={(e) => handleInputChange(e)}
									state={state}
								/>
								<Form.EmailInput
									handleInputChange={(e) => handleInputChange(e)}
									state={state}
								/>
								<Form.Password
									handleInputChange={(e) => handleInputChange(e)}
									state={state}
								/>
							</fieldset>

							<div className='form_footer flex-column-between'>
								<input
									type='submit'
									value='Sign up'
									name='signup'
									className='form_submit'
								/>
							</div>
							<p className='form_message'>
								Already registered?{' '}
								<button
									type='button'
									className='form_button'
									onClick={() => handleLoginClick()}>
									Sign In
								</button>
							</p>
						</Form>
					</article>
				</div>
			</section>
		</section>
	);
}

export default Auth;
