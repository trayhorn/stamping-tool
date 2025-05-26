import { useState } from "react";
import Loader from "../utils/Loader/Loader";

type StampImg = {
  name: string;
	imageURL: string;
};

export default function StampImg({ imageURL, name }: StampImg) {
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
				{!isLoaded && <Loader />}
			</div>
		</>
	);
}