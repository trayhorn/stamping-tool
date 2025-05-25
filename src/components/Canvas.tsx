import { useCallback, useRef, useState } from "react";
import { BASE_URL } from "../api";
import { nanoid } from "nanoid";

type CanvasType = {
	addStampImage: (newStamp: { _id: string; stamp: string }) => void;
	closeModal: () => void;
};

export default function Canvas({ addStampImage, closeModal }: CanvasType) {
	const startXRef = useRef(0);
	const startYRef = useRef(0);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const [drawing, setDrawing] = useState(false);

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
			.then(({ originalname }) => {
				addStampImage({ _id: nanoid(), stamp: originalname });
			})
			.catch((e) => console.log(e));
	};

	const handleSaveClick = () => {
		const canvas = canvasRef.current;

		if (!canvas) return;

		canvas.toBlob(async (blob) => {
			if (!blob) return;
			const file = new File([blob], "test.png");

			uploadImage(file);
			closeModal();
		}, "image/png");
	};

	return (
		<div>
			<canvas
				ref={canvasRef}
				id="myCanvasElement"
				width={500}
				height={500}
				onMouseDown={handleMouseDown}
				onMouseMove={drawing ? handleMouseMove : undefined}
				onMouseUp={handleMouseUp}
			></canvas>
			<button className="canvas-button" onClick={handleSaveClick}>
				Save
			</button>
		</div>
	);
}