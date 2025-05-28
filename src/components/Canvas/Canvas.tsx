import { useCallback, useRef, useState } from "react";
import { BASE_URL } from "../../api";
import { nanoid } from "nanoid";
import { StampImg } from "../../App";
import "./Canvas.scss";

type CanvasType = {
	addStampImage: (newStamp: StampImg) => void;
	closeModal: () => void;
};

export default function Canvas({ addStampImage, closeModal }: CanvasType) {
	const [isDisabled, setIsDisabled] = useState(true);
	const [drawing, setDrawing] = useState(false);

	const saveBtnRef = useRef<HTMLButtonElement | null>(null);
	const clearBtnRef = useRef<HTMLButtonElement | null>(null);

	const startXRef = useRef(0);
	const startYRef = useRef(0);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const handleMouseDown = (e: React.MouseEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const canvasRect = canvas.getBoundingClientRect();

		startXRef.current = e.clientX - canvasRect.left;
		startYRef.current = e.clientY - canvasRect.top;

		setDrawing(true);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!drawing) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const canvasRect = canvas.getBoundingClientRect();

		const { clientX, clientY } = e;

		const dx = clientX - canvasRect.left;
		const dy = clientY - canvasRect.top;

		drawLine(startXRef.current, startYRef.current, dx, dy);

		startXRef.current = dx;
		startYRef.current = dy;
	};

	const handleMouseUp = () => {
		setIsDisabled(false);
		setDrawing(false);
	};

	const drawLine = useCallback(
		(startX: number, startY: number, dx: number, dy: number) => {
			const canvas = document.getElementById(
				"myCanvasElement"
			) as HTMLCanvasElement;
			if (canvas) {
				const ctx = canvas.getContext("2d");
				if (ctx) {
					ctx.lineJoin = "round";
					ctx.lineWidth = 3;
					ctx.beginPath();
					ctx.moveTo(startX, startY);
					ctx.lineTo(dx, dy);
					ctx.stroke();
				}
			}
		},
		[]
	);

	const uploadImage = (file: File) => {
		const formData = new FormData();
		formData.append("stamp", file);

		fetch(`${BASE_URL}/stamp/upload`, {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then(({ originalname, url }) => {
				addStampImage({ _id: nanoid(), stamp: originalname, url });
			})
			.catch((e) => console.log(e));
	};

	const handleClearClick = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;


		const ctx = canvas.getContext("2d");
		ctx?.clearRect(0, 0, canvas.width, canvas.height);
		setIsDisabled(true);
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
					ref={clearBtnRef}
					className="canvas-button"
					disabled={isDisabled}
					onClick={handleClearClick}
				>
					Clear
				</button>
				<button
					ref={saveBtnRef}
					className="canvas-button"
					disabled={isDisabled}
					onClick={handleSaveClick}
				>
					Save
				</button>
			</div>
		</div>
	);
}