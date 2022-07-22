export const isEmpty = (value) =>
	value === undefined ||
	value === null ||
	(typeof value === 'object' && Object.keys(value).length === 0) ||
	(typeof value === 'string' && value.trim().length === 0);

export const UploadFile = async (file) => {
	try {
		const data = new FormData();
		data.append('file', file);
		data.append('upload_preset', 'social');
		data.append('cloud_name', 'dlvk5v5jr');

		// xai axios bi loi vi Headers -> fetch
		const response = await fetch(`https://api.cloudinary.com/v1_1/dlvk5v5jr/image/upload/`, {
			method: 'post',
			body: data,
		});
		let responseOK = response && response.status === 200 && response.statusText === 'OK';
		if (responseOK) {
			return response.json();
		}
	} catch (e) {
		console.log(e.message);
	}
};
