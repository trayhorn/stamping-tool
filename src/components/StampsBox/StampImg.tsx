import { useState } from "react";
import Loader from "../utils/Loader/Loader";

type StampImg = {
  imageURL: string;
}

export default function StampImg({ imageURL }: StampImg) {
  const [isLoaded, setIsLoaded] = useState(false);

	return (
    <>
      <div className="stamp-item">
        <img
          style={{opacity: isLoaded ? 1 : 0}}
          draggable="false"
          className="stamp"
          src={imageURL}
          alt="Stamp image"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(false)}
        />
        {!isLoaded && <Loader />}
      </div>
    </>
	);
}