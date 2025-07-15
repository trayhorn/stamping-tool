import { useState } from "react";
import Loader from "../utils/Loader/Loader";
import { MdDeleteOutline } from "react-icons/md";
import "./StampImg.scss";

type StampImg = {
	id: string;
	name: string;
	imageURL: string;
	handleStampDelete: (id: string) => void;
};

export default function StampImg({ imageURL, name, id, handleStampDelete }: StampImg) {
	const [isLoaded, setIsLoaded] = useState(false);

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
					onClick={() => handleStampDelete(id)}
					className="delete-icon"
				/>
				{!isLoaded && <Loader />}
			</div>
		</>
	);
}