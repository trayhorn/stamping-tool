import { useRef, useState } from "react";

export default function useDraw(
	canvasRef: React.RefObject<HTMLElement | null>,
) {
	const [isDisabled, setIsDisabled] = useState(true);
	const [drawing, setDrawing] = useState(false);

	const startXRef = useRef(0);
	const startYRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const canvasRect = canvas.getBoundingClientRect();

		startXRef.current = e.clientX - canvasRect.left;
		startYRef.current = e.clientY - canvasRect.top;

		setDrawing(true);
	};

  const handleMouseMove = (e: React.MouseEvent) => {
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

  const drawLine = (startX: number, startY: number, dx: number, dy: number) => {
		const canvas = canvasRef.current as HTMLCanvasElement;
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
  };

	return {
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		handleSetDisabled: () => setIsDisabled(true),
		drawing,
		isDisabled,
	};
}