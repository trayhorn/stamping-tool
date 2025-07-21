import { useState } from "react";
import Loader from "../utils/Loader/Loader";
import { MdDeleteOutline } from "react-icons/md";
import ReactModal from "../ReactModal/ReactModal";
import DeletePopUp from "../DeletePopUp/DeletePopUp";
import { useModal } from "../../hooks/useModal";
import "./StampImg.scss";

type StampImg = {
	id: string;
	name: string;
	imageURL: string;
	handleStampDelete: (id: string) => void;
};

export default function StampImg({ imageURL, name, id, handleStampDelete }: StampImg) {
	const [isLoaded, setIsLoaded] = useState(false);
	const { isModalShowing, openModal, closeModal } = useModal();

	return (
		<>
			<div className="stamp-item">
				<img
					style={{ opacity: isLoaded ? 1 : 0 }}
					draggable="false"
					className="stamp"
					src={imageURL}
					alt={name}
					onLoad={() => setIsLoaded(true)}
					onError={() => console.log("error with downloading images")}
				/>
				<MdDeleteOutline
					onClick={openModal}
					className="delete-icon"
				/>
				{!isLoaded && <Loader />}
			</div>

			<ReactModal isModalShowing={isModalShowing} closeModal={closeModal}>
				<DeletePopUp
					closeModal={closeModal}
					handleStampDelete={handleStampDelete}
					id={id}
				/>
			</ReactModal>
		</>
	);
}