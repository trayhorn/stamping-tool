import { StampType } from "../../App";
import "./Stamp.scss";
import { useState, useRef, useEffect } from "react";

type StampComponentType = {
	data: StampType;
	onClick: (id: string) => void;
	updateStamp: (updatedStamp: StampType) => void;
};

export default function Stamp({
	data,
	// onClick, for deleting the stamp
	updateStamp,
}: StampComponentType) {
	const { id, top, left, url, width, height } = data;

	const [isShowing, setIsShowing] = useState(false);
	const [newWidth, setNewWidth] = useState<number>(width);
	const [newHeight, setNewHeight] = useState<number>(height);


	const resizableRef = useRef<HTMLDivElement | null>(null);
	const resizeTopLeftRef = useRef<HTMLSpanElement | null>(null);
	const resizeBottomLeftRef = useRef<HTMLSpanElement | null>(null);
	const resizeTopRightRef = useRef<HTMLSpanElement | null>(null);
	const resizeBottomRightRef = useRef<HTMLSpanElement | null>(null);

	let startX = 0;
	let startY = 0;
	let newX = 0;
	let newY = 0;

	const handleMouseDown = (e: React.MouseEvent) => {
		startX = e.clientX;
		startY = e.clientY;

		document.addEventListener("mousemove", handleMouseMove);
	};

	const handleMouseMove = (e: MouseEvent) => {
		newX = startX - e.clientX;
		newY = startY - e.clientY;

		startX = e.clientX;
		startY = e.clientY;

		if (resizableRef.current) {
			resizableRef.current.style.top =
				resizableRef.current.offsetTop - newY + "px";
			resizableRef.current.style.left =
				resizableRef.current.offsetLeft - newX + "px";
		}
	};

	const handleMouseUp = () => {
		const resizableEl = resizableRef.current?.getBoundingClientRect();

		if (resizableEl) {
			const updatedStamp = {
				id,
				top: resizableEl.top + window.scrollY,
				left: resizableEl.left,
				url,
				width,
				height,
			};

			updateStamp(updatedStamp);
		}

		document.removeEventListener("mousemove", handleMouseMove);
	};

	// const handleResizeStop = () => {
	// 	const updatedStamp = {
	// 		id,
	// 		top,
	// 		left,
	// 		url,
	// 		width: newWidth,
	// 		height: newHeight,
	// 	};

	// 	updateStamp(updatedStamp);
	// };


	useEffect(() => {
		let x = 0;
		let y = 0;
		let elWidth = 100;
		let elHeight = 100;

		const resizableEl = resizableRef.current;

		if (!resizableEl) {
			return;
		}

		const styles = window.getComputedStyle(resizableEl);

		const handleResizeDown = (e: MouseEvent) => {
			console.log("calling mousedown");
			e.stopPropagation();

			y = e.clientY;
			x = e.clientX;

			document.addEventListener("mousemove", handleResizeMove);
			document.addEventListener("mouseup", handleResizeUp);
		};

		const handleResizeMove = (e: MouseEvent) => {
			const dy = e.clientY - y;
			const dx = e.clientX - x;
			elHeight = elHeight + dy;
			elWidth = elWidth + dx;
			y = e.clientY;
			x = e.clientX;

			resizableEl.style.height = elHeight + "px";
			resizableEl.style.width = elWidth + "px";
		};

		const handleResizeUp = () => {
			console.log("calling mouseup")
			document.removeEventListener("mousemove", handleResizeMove);
			document.removeEventListener("mouseup", handleResizeUp);
		};

		// Resize Top Right

		const handleResizeDownTopRight = (e: MouseEvent) => {
			console.log("calling mousedownTOP");
			e.stopPropagation();

			resizableEl.style.bottom = styles.bottom;
			resizableEl.style.top = "";

			y = e.clientY;
			x = e.clientX;

			console.log({ x, y });

			document.addEventListener("mousemove", handleResizeMoveTopRight);
			document.addEventListener("mouseup", handleResizeUpTopRight);
		};

		const handleResizeMoveTopRight = (e: MouseEvent) => {
			const dy = e.clientY - y;
			const dx = e.clientX - x;

			console.log({ dy, dx });

			elHeight = elHeight - dy;
			elWidth = elWidth + dx;
			y = e.clientY;
			x = e.clientX;

			resizableEl.style.height = elHeight + "px";
			resizableEl.style.width = elWidth + "px";
		};

		const handleResizeUpTopRight = () => {
			console.log("calling mouseupTOP");

			resizableEl.style.top = styles.top;
			resizableEl.style.bottom = "";

			document.removeEventListener("mousemove", handleResizeMoveTopRight);
			document.removeEventListener("mouseup", handleResizeUpTopRight);
		};

		// Resize Top Left

		const handleResizeDownTopLeft = (e: MouseEvent) => {
			console.log("calling mousedownTopLeft");
			e.stopPropagation();

			resizableEl.style.bottom = styles.bottom;
			resizableEl.style.right = styles.right;
			resizableEl.style.top = "";
			resizableEl.style.left = "";

			y = e.clientY;
			x = e.clientX;

			console.log({ x, y });

			document.addEventListener("mousemove", handleResizeMoveTopLeft);
			document.addEventListener("mouseup", handleResizeUpTopLeft);
		};

		const handleResizeMoveTopLeft = (e: MouseEvent) => {
			const dy = e.clientY - y;
			const dx = e.clientX - x;

			console.log({ dy, dx });

			elHeight = elHeight - dy;
			elWidth = elWidth - dx;
			y = e.clientY;
			x = e.clientX;

			resizableEl.style.height = elHeight + "px";
			resizableEl.style.width = elWidth + "px";
		};

		const handleResizeUpTopLeft = () => {
			console.log("calling mouseupTOP");

			resizableEl.style.top = styles.top;
			resizableEl.style.left = styles.left;
			resizableEl.style.bottom = "";
			resizableEl.style.right = "";

			document.removeEventListener("mousemove", handleResizeMoveTopLeft);
			document.removeEventListener("mouseup", handleResizeUpTopLeft);
		};

		// Resize Bottom Left

		const handleResizeDownBottomLeft = (e: MouseEvent) => {
			console.log("calling mousedownTopLeft");
			e.stopPropagation();

			resizableEl.style.right = styles.right;
			resizableEl.style.left = "";

			y = e.clientY;
			x = e.clientX;

			console.log({ x, y });

			document.addEventListener("mousemove", handleResizeMoveBottomLeft);
			document.addEventListener("mouseup", handleResizeUpBottomLeft);
		};

		const handleResizeMoveBottomLeft = (e: MouseEvent) => {
			const dy = e.clientY - y;
			const dx = e.clientX - x;

			console.log({ dy, dx });

			elHeight = elHeight + dy;
			elWidth = elWidth - dx;
			y = e.clientY;
			x = e.clientX;

			resizableEl.style.height = elHeight + "px";
			resizableEl.style.width = elWidth + "px";
		};

		const handleResizeUpBottomLeft = () => {
			console.log("calling mouseupTOP");

			resizableEl.style.left = styles.left;
			resizableEl.style.right = "";

			document.removeEventListener("mousemove", handleResizeMoveBottomLeft);
			document.removeEventListener("mouseup", handleResizeUpBottomLeft);
		};

		const bottomRightHandle = resizeBottomRightRef.current;
		const topRightHandle = resizeTopRightRef.current;
		const topLeftHandle = resizeTopLeftRef.current;
		const bottomLeftHandle = resizeBottomLeftRef.current;

		bottomRightHandle?.addEventListener("mousedown", handleResizeDown);
		topRightHandle?.addEventListener("mousedown", handleResizeDownTopRight);
		topLeftHandle?.addEventListener("mousedown", handleResizeDownTopLeft);
		bottomLeftHandle?.addEventListener("mousedown", handleResizeDownBottomLeft);

		return () => {
			bottomRightHandle?.removeEventListener("mousedown", handleResizeDown);
			topRightHandle?.removeEventListener(
				"mousedown",
				handleResizeDownTopRight
			);
			topLeftHandle?.removeEventListener("mousedown", handleResizeDownTopLeft);
			bottomLeftHandle?.removeEventListener(
				"mousedown",
				handleResizeDownBottomLeft
			);
		}
	})

	return (
		<>
			{isShowing ? (
				<div
					ref={resizableRef}
					className="dragable-box"
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
					onClick={() => setIsShowing((prev: boolean) => !prev)}
					style={{
						position: "absolute",
						top,
						left,
						width: newWidth,
						height: newHeight,
					}}
				>
					{/* <button className="rotate-btn">Rotate</button> */}

					<img
						draggable="false"
						className="stamp clone"
						src={url}
						alt="stamp_1"
					/>

					<span
						ref={resizeTopLeftRef}
						className="resize-handle top-left"
					></span>
					<span
						ref={resizeTopRightRef}
						className="resize-handle top-right"
					></span>
					<span
						ref={resizeBottomLeftRef}
						className="resize-handle bottom-left"
					></span>
					<span
						ref={resizeBottomRightRef}
						className="resize-handle bottom-right"
					></span>
				</div>
			) : (
				<div
					onClick={() => setIsShowing((prev: boolean) => !prev)}
					style={{
						position: "absolute",
						top,
						left,
						width: newWidth,
						height: newHeight,
					}}
				>
					<img
						// onDoubleClick={() => onClick(id)}
						draggable="false"
						className="stamp clone"
						src={url}
						alt="stamp_1"
					/>
				</div>
			)}
		</>
	);
}


	// Working on rotation

	// const centerRef = useRef({ x: 0, y: 0 });

	// const rotateMouseDown = () => {
	// 	console.log("calling MouseDown");

	// 	console.log(stampBoxRef.current);

	// 	if (stampRef.current) {
	// 		const elRect = stampRef.current.getBoundingClientRect();

	// 		centerRef.current.x = elRect.left + elRect.width / 2;
	// 		centerRef.current.y = elRect.top + elRect.height / 2;

	// 		document.addEventListener('mouseup', rotateMouseUp);
	// 		document.addEventListener("mousemove", rotateMouseMove);
	// 	}
	// };

	// const rotateMouseMove = (e: MouseEvent) => {
	// 	console.log('mousemove');
	// 	const angle = Math.atan2(
	// 		e.pageY - centerRef.current.y,
	// 		e.pageX - centerRef.current.x
	// 	);
	// 	const convertedAngle = ((angle * 180) / Math.PI + 90 + 360) % 360;

	// 	if (stampRef.current) {
	// 		stampRef.current.style.transform = `rotate(${convertedAngle}deg)`;
	// 	}
	// };

	// const rotateMouseUp = () => {
	// 	document.removeEventListener("mousemove", rotateMouseMove);
	// 	document.removeEventListener('mouseup', rotateMouseUp);
	// };