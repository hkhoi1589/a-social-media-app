import React, { useState, memo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { handleLoading } from '../../reducers/uiReducer';
import { CreatePost } from '../../reducers/postReducer';
import Profile from '../Profile';
import Modal from '../Modal';
import { UploadFile } from '../../helpers';
import './index.scss';
import { Link } from 'react-router-dom';

function UploadPost() {
	const { authUser, followers } = useSelector((state) => state.authReducer, shallowEqual);
	const { _id, username, profilePicture } = authUser;
	const dispatch = useDispatch();

	const [selectedImage, setSelectedImage] = useState(undefined);
	const [isPostShow, setPostShow] = useState(false);
	const [text, setText] = useState('');

	const handlePostShow = () => {
		setPostShow(!isPostShow);
		setText('');
	};

	const handleUploadPost = async () => {
		await dispatch(handleLoading(true)); // bat loading
		let imageUrl = '';
		if (selectedImage instanceof File) {
			imageUrl = await UploadFile(selectedImage);
			imageUrl = imageUrl.secure_url;
		}

		handlePostShow();
		await dispatch(CreatePost(text, imageUrl, followers));
		setSelectedImage(undefined); // reset
	};

	return (
		<article>
			<div className='upload-post'>
				<div className='container'>
					<div className='flex-between-center'>
						<Link to={`/person/${_id}`}>
							<Profile.Img img={profilePicture} />
						</Link>
						<button
							type='button'
							className='upload-post_button'
							onClick={() => handlePostShow()}>
							Post something...
						</button>
					</div>
				</div>
			</div>

			<Modal isShow={isPostShow} handleShow={handlePostShow}>
				<Modal.Header>Create post</Modal.Header>
				<div className='container'>
					<Modal.Body>
						<Profile id={_id}>
							<Profile.Img img={profilePicture} />
							<Profile.Name>{username}</Profile.Name>
						</Profile>
						<Modal.Content>
							<Modal.TextArea text={text} id='upload-post' setText={setText}>
								Write something...
							</Modal.TextArea>
							{selectedImage && (
								<Modal.Preview
									selectedImage={selectedImage}
									setSelectedImage={setSelectedImage}
								/>
							)}
						</Modal.Content>
					</Modal.Body>
					<Modal.Footer>
						<Modal.UploadFile setSelectedImage={setSelectedImage} id='uploadPostFile'>
							Image
						</Modal.UploadFile>
						<Modal.UploadBtn handleClick={() => handleUploadPost()}>
							Post
						</Modal.UploadBtn>
					</Modal.Footer>
				</div>
			</Modal>
		</article>
	);
}

export default memo(UploadPost);
