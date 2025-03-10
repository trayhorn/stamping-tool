import { StampType } from "../../App";
import "./Stamp.scss";
import { useState, useRef } from "react";
import { ResizableBox } from "react-resizable";


type StampComponentType = {
	data: StampType;
	onClick: (id: string) => void;
	updateStampPosition: (updatedStamp: StampType) => void;
};

export default function Stamp({ data, onClick, updateStampPosition }: StampComponentType) {
	const { id, top, left, url, width, height } = data;

	const [isShowing, setIsShowing] = useState(false);
	const [newWidth, setNewWidth] = useState<number>(width);
	const [newHeight, setNewHeight] = useState(height);

	const stampRef = useRef<HTMLImageElement | null>(null);

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

		if (stampRef.current) {
			stampRef.current.style.top = stampRef.current.offsetTop - newY + "px";
			stampRef.current.style.left = stampRef.current.offsetLeft - newX + "px";
		}
	};

	const handleMouseUp = () => {
		const stampRect = stampRef.current?.getBoundingClientRect();

		if (stampRect) {
			const updatedStamp = {
				id,
				top: stampRect.top + window.scrollY,
				left: stampRect.left,
				url,
				width,
				height,
			};

			updateStampPosition(updatedStamp);
		}

		document.removeEventListener("mousemove", handleMouseMove);
	};

	const handleResizeStop = () => {
		const updatedStamp = {
			id,
			top,
			left,
			url,
			width: newWidth,
			height: newHeight
		};

		updateStampPosition(updatedStamp);
	}

	return (
		<>
			{isShowing ? (
				<ResizableBox
					className="box"
					width={newWidth}
					height={newHeight}
					style={{ top, left }}
					lockAspectRatio={true}
					resizeHandles={["sw", "se", "nw", "ne"]}
					handle={(h, ref) => (
						<span className={`custom-handle custom-handle-${h}`} ref={ref} />
					)}
					onResize={(_, { size }) => {
						setNewWidth(size.width);
						setNewHeight(size.height);
					}}
					onResizeStop={handleResizeStop}
				>
					<img
						ref={stampRef}
						onClick={() => setIsShowing((prev: boolean) => !prev)}
						draggable="false"
						className="stamp clone"
						src={url}
						alt="stamp_1"
					/>
				</ResizableBox>
			) : (
				<div
					style={{
						position: "absolute",
						top,
						left,
						width: newWidth,
						height: newHeight,
					}}
				>
					<img
						ref={stampRef}
						onMouseDown={handleMouseDown}
						onMouseUp={handleMouseUp}
						onClick={() => setIsShowing((prev: boolean) => !prev)}
						onDoubleClick={() => onClick(id)}
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
