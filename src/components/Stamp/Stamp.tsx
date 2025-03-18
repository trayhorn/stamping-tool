import { StampType } from "../../App";
import "./Stamp.scss";
import { useState, useRef, useEffect } from "react";
import { FaRotateRight } from "react-icons/fa6";

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
	const { top, left, url, width, height, rotate } = data;

	const [isShowing, setIsShowing] = useState(false);

	const resizableRef = useRef<HTMLDivElement | null>(null);
	const resizeTopLeftRef = useRef<HTMLSpanElement | null>(null);
	const resizeBottomLeftRef = useRef<HTMLSpanElement | null>(null);
	const resizeTopRightRef = useRef<HTMLSpanElement | null>(null);
	const resizeBottomRightRef = useRef<HTMLSpanElement | null>(null);

	let startX = 0;
	let startY = 0;
	let initialX = 0;
	let initialY = 0;
	let newX = 0;
	let newY = 0;

	const handleMouseDown = (e: React.MouseEvent) => {
		startX = e.clientX;
		startY = e.clientY;

		initialX = e.clientX;
		initialY = e.clientY;

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

	const handleMouseUp = (e: React.MouseEvent) => {
		const resizableEl = resizableRef.current;
		const el = e.target as HTMLElement;

		if (!resizableEl) return;
		// if (el.classList.contains("rotate-btn")) return;
		// if (initialX === e.clientX && initialY === e.clientY) return;

		const rect = resizableEl.getBoundingClientRect();

		if (rotate !== 0) {
			const computedStyle = window.getComputedStyle(resizableEl);

			const newTop = rect.top;
			const newLeft = rect.left;

			const transform = computedStyle.transform;
			let angle = 0;

			if (transform !== "none") {
				console.log('updateStamp when dragging rotated');
				const match = transform.match(
					/matrix\(([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^)]+)\)/
				);
				if (match) {
					const a = parseFloat(match[1]);
					const b = parseFloat(match[2]);
					angle = ((Math.atan2(b, a) * (180 / Math.PI) + 360) % 360) % 90;
				}
			}

			const radians = (angle * Math.PI) / 180;

			const initialLeft = Math.round(
				newLeft +
				(width / 2) * (Math.cos(radians) - 1) +
				(height / 2) * Math.sin(radians)
			);
			const initialTop = Math.round(
				newTop +
				(width / 2) * Math.sin(radians) +
				(height / 2) * (Math.cos(radians) - 1)
			);

			updateStamp({
				...data,
				top: initialTop,
				left: initialLeft,
			});
		} else {
			console.log("updateStamp in handleMouseUp");
			updateStamp({
				...data,
				top: rect.top + window.scrollY,
				left: rect.left + window.scrollX,
			});
		}

		document.removeEventListener("mousemove", handleMouseMove);
	};


	// Rotation

	const centerRef = useRef({ x: 0, y: 0 });

	const rotateMouseDown = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (resizableRef.current) {
			const elRect = resizableRef.current.getBoundingClientRect();

			centerRef.current.x = elRect.left + elRect.width / 2;
			centerRef.current.y = elRect.top + elRect.height / 2;

			document.addEventListener("mouseup", rotateMouseUp);
			document.addEventListener("mousemove", rotateMouseMove);
		}
	};

	const rotateMouseMove = (e: MouseEvent) => {
		const angle = Math.atan2(
			e.pageY - centerRef.current.y,
			e.pageX - centerRef.current.x
		);
		const convertedAngle = ((angle * 180) / Math.PI + 90 + 360) % 360;

		if (resizableRef.current) {
			resizableRef.current.style.transform = `rotate(${convertedAngle}deg)`;
		}
	};

	const rotateMouseUp = (e: MouseEvent) => {
		const angle = Math.atan2(
			e.pageY - centerRef.current.y,
			e.pageX - centerRef.current.x
		);
		const convertedAngle = ((angle * 180) / Math.PI + 90 + 360) % 360;
		console.log(convertedAngle);

		if (resizableRef.current) {
			updateStamp({
				...data,
				rotate: convertedAngle,
			});
		}

		document.removeEventListener("mousemove", rotateMouseMove);
		document.removeEventListener('mouseup', rotateMouseUp);
	};


	useEffect(() => {
		let x = 0;
		let y = 0;
		let elWidth = width;
		let elHeight = height;

		const resizableEl = resizableRef.current;

		if (!resizableEl) {
			return;
		}

		const styles = window.getComputedStyle(resizableEl);

		const handleResizeDown = (e: MouseEvent) => {
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

			updateStamp({
				...data,
				width: elWidth,
				height: elHeight,
			});
		
			document.removeEventListener("mousemove", handleResizeMove);
			document.removeEventListener("mouseup", handleResizeUp);
		};

		// Resize Top Right

		const handleResizeDownTopRight = (e: MouseEvent) => {
			e.stopPropagation();

			resizableEl.style.bottom = styles.bottom;
			resizableEl.style.top = "";

			y = e.clientY;
			x = e.clientX;

			document.addEventListener("mousemove", handleResizeMoveTopRight);
			document.addEventListener("mouseup", handleResizeUpTopRight);
		};

		const handleResizeMoveTopRight = (e: MouseEvent) => {
			const dy = e.clientY - y;
			const dx = e.clientX - x;

			elHeight = elHeight - dy;
			elWidth = elWidth + dx;
			y = e.clientY;
			x = e.clientX;

			resizableEl.style.height = elHeight + "px";
			resizableEl.style.width = elWidth + "px";
		};

		const handleResizeUpTopRight = () => {
			resizableEl.style.top = styles.top;
			resizableEl.style.bottom = "";


			updateStamp({
				...data,
				top: resizableEl.getBoundingClientRect().top + window.scrollY,
				width: elWidth,
				height: elHeight,
			});

			document.removeEventListener("mousemove", handleResizeMoveTopRight);
			document.removeEventListener("mouseup", handleResizeUpTopRight);
		};

		// Resize Top Left

		const handleResizeDownTopLeft = (e: MouseEvent) => {
			e.stopPropagation();

			resizableEl.style.bottom = styles.bottom;
			resizableEl.style.right = styles.right;
			resizableEl.style.top = "";
			resizableEl.style.left = "";

			y = e.clientY;
			x = e.clientX;

			document.addEventListener("mousemove", handleResizeMoveTopLeft);
			document.addEventListener("mouseup", handleResizeUpTopLeft);
		};

		const handleResizeMoveTopLeft = (e: MouseEvent) => {
			const dy = e.clientY - y;
			const dx = e.clientX - x;

			elHeight = elHeight - dy;
			elWidth = elWidth - dx;
			y = e.clientY;
			x = e.clientX;

			resizableEl.style.height = elHeight + "px";
			resizableEl.style.width = elWidth + "px";
		};

		const handleResizeUpTopLeft = () => {
			resizableEl.style.top = styles.top;
			resizableEl.style.left = styles.left;
			resizableEl.style.bottom = "";
			resizableEl.style.right = "";

			const elRect = resizableEl.getBoundingClientRect();


			updateStamp({
				...data,
				top: elRect.top + window.scrollY,
				left: elRect.left,
				width: elWidth,
				height: elHeight,
			});

			document.removeEventListener("mousemove", handleResizeMoveTopLeft);
			document.removeEventListener("mouseup", handleResizeUpTopLeft);
		};

		// Resize Bottom Left

		const handleResizeDownBottomLeft = (e: MouseEvent) => {
			e.stopPropagation();

			resizableEl.style.right = styles.right;
			resizableEl.style.left = "";

			y = e.clientY;
			x = e.clientX;

			document.addEventListener("mousemove", handleResizeMoveBottomLeft);
			document.addEventListener("mouseup", handleResizeUpBottomLeft);
		};

		const handleResizeMoveBottomLeft = (e: MouseEvent) => {
			const dy = e.clientY - y;
			const dx = e.clientX - x;

			elHeight = elHeight + dy;
			elWidth = elWidth - dx;
			y = e.clientY;
			x = e.clientX;

			resizableEl.style.height = elHeight + "px";
			resizableEl.style.width = elWidth + "px";
		};

		const handleResizeUpBottomLeft = () => {
			resizableEl.style.left = styles.left;
			resizableEl.style.right = "";

			const elRect = resizableEl.getBoundingClientRect();


			updateStamp({
				...data,
				left: elRect.left,
				width: elWidth,
				height: elHeight,
			});

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
					onClick={(e) => {
						const el = e.target as HTMLElement;
						if (el.classList.contains("stamp")) {
							setIsShowing((prev: boolean) => !prev);
						}
					}}
					style={{
						position: "absolute",
						top,
						left,
						width,
						height,
						transform: `rotate(${rotate}deg)`,
					}}
				>
					<FaRotateRight
						className="rotate-btn"
						onMouseDown={rotateMouseDown}
						style={{ left: `${width / 2 - 8}px` }}
					/>

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
						width,
						height,
						transform: `rotate(${rotate}deg)`,
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


	