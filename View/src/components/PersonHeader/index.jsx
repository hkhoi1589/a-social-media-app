import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RemoveUser, UpdateUser } from '../../reducers/authReducer';
import { handleLoading } from '../../reducers/uiReducer';
import { FollowUser, UnfollowUser } from '../../reducers/userReducer';
import Form from '../Form';
import Modal from '../Modal';
import Profile from '../Profile';
import { UploadFile } from '../../helpers';
import './index.scss';

function PersonHeader({
	id,
	username,
	coverPicture,
	profilePicture,
	desc,
	authUser,
	isUnfollowed,
}) {
	const dispatch = useDispatch();

	const [isRemoveShow, setRemoveShow] = useState(false);
	const [isEditShow, setEditShow] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState(undefined);
	const [selectedCover, setSelectedCover] = useState(undefined);
	const [state, setState] = useState({
		username: '',
		email: '',
		password: '',
		desc: '',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setState({ ...state, [name]: value });
	};

	const handleRemoveShow = () => {
		setRemoveShow(!isRemoveShow);
	};

	const handleEditShow = () => {
		setEditShow(!isEditShow);
	};

	const handleEditForm = async () => {
		handleEditShow();
		await dispatch(handleLoading(true));

		let cover = coverPicture,
			profile = profilePicture;
		if (selectedCover instanceof File) {
			// neu thay doi cover
			cover = await UploadFile(selectedCover);
			cover = cover.secure_url;
		}
		if (selectedProfile instanceof File) {
			// neu thay doi profile
			profile = await UploadFile(selectedProfile);
			profile = profile.secure_url;
		}
		setSelectedProfile(undefined); // reset
		setSelectedCover(undefined); // reset
		const { username, email, password, desc } = state;
		await dispatch(UpdateUser(username, email, password, cover, profile, desc));
	};

	const handleUnfollow = async () => {
		await dispatch(UnfollowUser(id, authUser._id));
	};

	const handleFollow = async () => {
		await dispatch(FollowUser(id, profilePicture, username, authUser._id));
	};

	return (
		<>
			<article className='person-header'>
				<div className='person-header_img'>
					<div className='person-header_cover'>
						<img src={coverPicture} alt='cover.png' />
					</div>
					<div className='person-header_user'>
						<Profile.Img img={profilePicture} isHugeImg={true} />
					</div>
				</div>
				<div className='person-header_info'>
					<h4>{username}</h4>
					<span>{desc}</span>
				</div>
				{authUser._id !== id ? (
					<div className='person-header_buttons'>
						{isUnfollowed ? (
							<button
								type='button'
								className='btn person-header_button person-header_button--gray'
								onClick={() => handleUnfollow()}>
								<i className='fa-solid fa-user-minus'></i>
								<p>Unfollow</p>
							</button>
						) : (
							<button
								type='button'
								className='btn person-header_button person-header_button--red'
								onClick={() => handleFollow()}>
								<i className='fa-solid fa-user-plus'></i>
								<p>Follow</p>
							</button>
						)}
					</div>
				) : (
					<div className='person-header_buttons'>
						<button
							type='button'
							className='btn person-header_button person-header_button--red'
							onClick={() => handleEditShow()}>
							<i className='fa-solid fa-pen-to-square'></i>
							<p>Edit Profile</p>
						</button>
						<button
							type='button'
							className='btn person-header_button person-header_button--gray'
							onClick={() => handleRemoveShow()}>
							<i className='fa-solid fa-user-xmark'></i>
							<p>Delete Profile</p>
						</button>
					</div>
				)}
			</article>

			<Modal isShow={isEditShow} handleShow={handleEditShow}>
				<Modal.Header>Edit Account</Modal.Header>
				<div className='container'>
					<Modal.Body>
						<Modal.Content>
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
							<Form.DescInput
								handleInputChange={(e) => handleInputChange(e)}
								state={state}
							/>

							<Modal.UploadFile
								setSelectedImage={setSelectedProfile}
								id='profilePicture'>
								Profile Picture
							</Modal.UploadFile>
							{selectedProfile && (
								<Modal.Preview
									selectedImage={selectedProfile}
									setSelectedImage={setSelectedProfile}
								/>
							)}

							<Modal.UploadFile setSelectedImage={setSelectedCover} id='coverPicture'>
								Cover Photo
							</Modal.UploadFile>
							{selectedCover && (
								<Modal.Preview
									selectedImage={selectedCover}
									setSelectedImage={setSelectedCover}
								/>
							)}
						</Modal.Content>
					</Modal.Body>
					<div className='person-header_buttons'>
						<button
							type='button'
							className='btn person-header_button person-header_button--red'
							onClick={() => handleEditForm()}>
							<i className='fa-solid fa-check'></i>
							<p>Yes</p>
						</button>
						<button
							type='button'
							className='btn person-header_button person-header_button--gray'
							onClick={() => handleEditShow()}>
							<i className='fa-solid fa-xmark'></i>
							<p>No</p>
						</button>
					</div>
				</div>
			</Modal>

			<Modal isShow={isRemoveShow} handleShow={handleRemoveShow}>
				<Modal.Header>Remove Account</Modal.Header>
				<div className='container'>
					<Modal.Body>
						<Modal.Content>
							<h2>Are you sure?</h2>
						</Modal.Content>
					</Modal.Body>
					<div className='person-header_buttons'>
						<button
							type='button'
							className='btn person-header_button person-header_button--red'
							onClick={() => handleRemoveShow()}>
							<i className='fa-solid fa-xmark'></i>
							<p>No</p>
						</button>
						<button
							type='button'
							className='btn person-header_button person-header_button--gray'
							onClick={async () => await dispatch(RemoveUser())}>
							<i className='fa-solid fa-check'></i>
							<p>Yes</p>
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}

export default memo(PersonHeader);
