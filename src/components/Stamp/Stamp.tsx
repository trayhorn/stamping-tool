import { StampType } from "../../App";
import "./Stamp.scss";
import { useState, useRef, useEffect } from "react";
import { FaRotateRight, FaRegTrashCan } from "react-icons/fa6";
import calculateCoordinates from "../utils/calculateCoordinates";

type StampComponentType = {
	data: StampType;
	onDeleteClick: (id: string) => void;
	updateStamp: (updatedStamp: StampType) => void;
};

export default function Stamp({ data, onDeleteClick, updateStamp }: StampComponentType) {
	const { id, top, left, url, width, height, rotate } = data;

	const [isShowing, setIsShowing] = useState(false);

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

	const handleMouseUp = (e: React.MouseEvent) => {
		const resizableEl = resizableRef.current;
		const el = e.target as HTMLElement;

		if (!resizableEl) return;
		if (el.classList.contains("rotate-btn")) return;

		const rect = resizableEl.getBoundingClientRect();

		if (rotate !== 0) {
			console.log("element rotated - updating stamp");

			const computedStyle = window.getComputedStyle(resizableEl);
			const transform = computedStyle.transform;
			const newTop = rect.top;
			const newLeft = rect.left;

			const params = { newTop, newLeft, transform, width, height };

			const coordinates = calculateCoordinates(params);

			updateStamp({
				...data,
				top: coordinates.initialTop + window.scrollY,
				left: coordinates.initialLeft + window.scrollX,
			});
		} else {
			console.log("element isn't rotated - updating stamp");
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

			centerRef.current.x = elRect.left + window.scrollX + elRect.width / 2;
			centerRef.current.y = elRect.top + window.scrollY + elRect.height / 2;

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
		document.removeEventListener("mouseup", rotateMouseUp);
	};

	useEffect(() => {
		let y = 0;
		let ratio = 0;
		let elWidth = width;
		let elHeight = height;

		const resizableEl = resizableRef.current;

		if (!resizableEl) {
			return;
		}

		const styles = window.getComputedStyle(resizableEl);

		const handleResizeDown = (e: MouseEvent) => {
			e.stopPropagation();
			ratio = width / height;

			y = e.clientY;

			document.addEventListener("mousemove", handleResizeMove);
			document.addEventListener("mouseup", handleResizeUp);
		};

		const handleResizeMove = (e: MouseEvent) => {
			const dy = e.clientY - y;
			elHeight = elHeight + dy;
			elWidth = elWidth + ratio * dy;
			y = e.clientY;

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
			ratio = width / height;

			resizableEl.style.bottom = styles.bottom;
			resizableEl.style.top = "";

			y = e.clientY;

			document.addEventListener("mousemove", handleResizeMoveTopRight);
			document.addEventListener("mouseup", handleResizeUpTopRight);
		};

		const handleResizeMoveTopRight = (e: MouseEvent) => {
			const dy = e.clientY - y;

			elHeight = elHeight - dy;
			elWidth = elWidth - ratio * dy;
			y = e.clientY;

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
			ratio = width / height;

			resizableEl.style.bottom = styles.bottom;
			resizableEl.style.right = styles.right;
			resizableEl.style.top = "";
			resizableEl.style.left = "";

			y = e.clientY;

			document.addEventListener("mousemove", handleResizeMoveTopLeft);
			document.addEventListener("mouseup", handleResizeUpTopLeft);
		};

		const handleResizeMoveTopLeft = (e: MouseEvent) => {
			const dy = e.clientY - y;

			elHeight = elHeight - dy;
			elWidth = elWidth - ratio * dy;
			y = e.clientY;

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
			ratio = width / height;

			resizableEl.style.right = styles.right;
			resizableEl.style.left = "";

			y = e.clientY;

			document.addEventListener("mousemove", handleResizeMoveBottomLeft);
			document.addEventListener("mouseup", handleResizeUpBottomLeft);
		};

		const handleResizeMoveBottomLeft = (e: MouseEvent) => {
			const dy = e.clientY - y;

			elHeight = elHeight + dy;
			elWidth = elWidth + ratio * dy;
			y = e.clientY;

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
		};
	});

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

					<div
						className="delete-btn_wrapper"
						onClick={() => onDeleteClick(id)}
					>
						<FaRegTrashCan className="delete-btn" />
					</div>

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


	