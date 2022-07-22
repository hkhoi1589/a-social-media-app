import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { handleAlert } from '../../reducers/uiReducer';
import './index.scss';

function Modal({ children, isShow, handleShow }) {
	// Ngăn scroll khi modal
	useEffect(() => {
		if (isShow) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = 'auto';
	}, [isShow]);

	return (
		<article className={`modal ${isShow ? '' : 'hide'} flex-center-center`}>
			<div className='background background--gray' onClick={() => handleShow()}></div>
			<div className='modal_form'>{children}</div>
		</article>
	);
}

Modal.Header = function Header({ children }) {
	return <div className='modal_header'>{children}</div>;
};

Modal.Body = function Body({ children }) {
	return <div>{children}</div>;
};

Modal.Content = function Content({ children }) {
	return <div className='modal_content'>{children}</div>;
};

Modal.TextArea = function TextArea({ children, id, text, setText }) {
	return (
		<textarea
			name='postContent'
			id={id}
			autoFocus
			placeholder={children}
			className='modal_text'
			value={text}
			onChange={(e) => setText(e.target.value)}></textarea>
	);
};

Modal.Preview = function Preview({ selectedImage, setSelectedImage }) {
	const file = URL.createObjectURL(selectedImage); // tao img object url

	const removeSelectedImage = () => {
		setSelectedImage(undefined);
	};

	return (
		<div className='modal_preview'>
			{/* onLoad: xoa img object url, tranh tran bo nho */}
			<img src={file} alt='your_image' onLoad={() => URL.revokeObjectURL(file)} />
			<button type='button' className='circle' onClick={() => removeSelectedImage()}>
				<i className='fa-solid fa-x'></i>
			</button>
		</div>
	);
};

Modal.UploadFile = function UploadFile({ children, id, setSelectedImage }) {
	const dispatch = useDispatch();
	const imageChange = (e) => {
		//chi nhan image
		if (e.target.files && e.target.files.length > 0 && /image/.test(e.target.files[0].type)) {
			setSelectedImage(e.target.files[0]);
		} else {
			dispatch(handleAlert({ message: 'Accept only images', type: 'error', isAlert: true }));
		}
	};
	return (
		<label htmlFor={id} className='modal_upload modal_upload--file flex-center-center'>
			<i className='fa-solid fa-image'></i>
			<input
				type='file'
				accept='image/*'
				id={id}
				placeholder='...'
				onClick={(e) => (e.target.value = null)} // input file không nhận cùng tên file 2 lần, cần reset
				onChange={(e) => imageChange(e)}
			/>
			<p>{children}</p>
		</label>
	);
};

Modal.UploadBtn = function UploadBtn({ children, handleClick }) {
	return (
		<button
			type='button'
			className='modal_upload modal_upload--post flex-center-center'
			onClick={handleClick}>
			<i className='fa-solid fa-upload'></i>
			<p>{children}</p>
		</button>
	);
};

Modal.Footer = function Footer({ children }) {
	return <div className='modal_footer flex-between'>{children}</div>;
};

export default Modal;
