import { useCallback } from 'react';
import { useState, useEffect } from 'react';

const useInfiniteScroll = (callback, page) => {
	const [isFetching, setIsFetching] = useState(false);

	const handleScroll = useCallback(() => {
		if (
			window.innerHeight + window.scrollY >= document.body.offsetHeight &&
			!isFetching &&
			page !== -1
		)
			setIsFetching(true);
		return;
	}, [isFetching, page]);

	// them event vao window
	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	// chay callback
	useEffect(() => {
		if (!isFetching) return;
		callback(page);
	}, [callback, page, isFetching]);

	return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
