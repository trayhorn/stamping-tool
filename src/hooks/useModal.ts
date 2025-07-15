import { useState } from "react";

export const useModal = () => {
	const [isModalShowing, setIsModalShowing] = useState<boolean>(false);

	const openModal = () => {
		setIsModalShowing(true);
	};

	const closeModal = () => {
		setIsModalShowing(false);
	};

	return { isModalShowing, openModal, closeModal };
};
