import { useRef } from "react";
import { nanoid } from "nanoid";
import { BASE_URL } from "../../api";
import { StampImg } from "../../App";
import useDraw from "../../hooks/useDraw";
import { useTranslation } from "react-i18next";
import "./Canvas.scss";

type CanvasType = {
	addStampImage: (newStamp: StampImg) => void;
	closeModal: () => void;
};

export default function Canvas({ addStampImage, closeModal }: CanvasType) {
	const { t } = useTranslation();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const {
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		handleSetDisabled,
		drawing,
		isDisabled,
	} = useDraw(canvasRef);

	const uploadImage = (file: File) => {
		const formData = new FormData();
		formData.append("stamp", file);

		fetch(`${BASE_URL}/stamp/upload`, {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then(({ originalname, url, _id }) => {
				addStampImage({ _id, stamp: originalname, url });
			})
			.catch((e) => console.log(e));
	};

	const handleClearClick = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		ctx?.clearRect(0, 0, canvas.width, canvas.height);
		handleSetDisabled();
	}

	const handleSaveClick = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.toBlob(async (blob) => {
			if (!blob) return;
			const file = new File([blob], nanoid() + "png");

			uploadImage(file);
			closeModal();
		}, "image/png");
	};

	return (
		<div>
			<canvas
				ref={canvasRef}
				id="stampsCanvas"
				width={500}
				height={500}
				onMouseDown={handleMouseDown}
				onMouseMove={drawing ? handleMouseMove : undefined}
				onMouseUp={handleMouseUp}
			></canvas>
			<div className="canvas-button_wrapper">
				<button
					className="canvas-button"
					disabled={isDisabled}
					onClick={handleClearClick}
				>
					{t("clear")}
				</button>
				<button
					className="canvas-button"
					disabled={isDisabled}
					onClick={handleSaveClick}
				>
					{t("save")}
				</button>
			</div>
		</div>
	);
}