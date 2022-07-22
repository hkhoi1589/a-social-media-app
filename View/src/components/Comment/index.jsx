import React, { useState, memo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { EditComment, RemoveComment } from '../../reducers/postReducer';
import { Link } from 'react-router-dom';
import Noti from '../Noti';
import Profile from '../Profile';
import UploadComment from '../UploadComment';
import './index.scss';

function Comment({ _id, user, text, postId, index }) {
	const { authUser } = useSelector((state) => state.authReducer, shallowEqual);
	const dispatch = useDispatch();

	const [newText, setNewText] = useState(text);
	const [isNotiCmt, setIsNotiCmt] = useState(false);
	const [isEdit, setIsEdit] = useState(false);

	const handleEditComment = async () => {
		await dispatch(EditComment(_id, postId, newText));
		setIsEdit(!isEdit);
	};

	const handleEdit = () => {
		setIsEdit(!isEdit);
		setIsNotiCmt(!isNotiCmt);
	};

	const handleRemoveComment = async () => {
		await dispatch(RemoveComment(_id, postId));
		setIsNotiCmt(!isNotiCmt);
	};

	return (
		<article className='comment'>
			{isEdit ? (
				<UploadComment>
					<UploadComment.Label index={index}>
						<Link to={`/person/${_id}`}>
							<Profile.Img img={user.profilePicture} />
						</Link>
						<UploadComment.Input index={index} text={newText} setText={setNewText} />
					</UploadComment.Label>
					<UploadComment.Btn handleClick={() => handleEditComment()} />
				</UploadComment>
			) : (
				<>
					<Link to={`/person/${_id}`}>
						<Profile.Img img={user.profilePicture} />
					</Link>
					<div className='comment_text'>
						<Link to={`/person/${_id}`}>
							<Profile.Name>{user.username}</Profile.Name>
						</Link>
						<p>{text}</p>
					</div>

					{user._id === authUser._id && ( // cmt cua authUser
						<Noti isEdit={true} isNoti={isNotiCmt} setIsNoti={setIsNotiCmt}>
							<li>
								<Noti.NotiLink isEdit={true} handleClick={() => handleEdit()}>
									Edit
								</Noti.NotiLink>
							</li>
							<li>
								<Noti.NotiLink
									isEdit={true}
									handleClick={() => handleRemoveComment()}>
									Remove
								</Noti.NotiLink>
							</li>
						</Noti>
					)}
				</>
			)}
		</article>
	);
}

export default memo(Comment);
