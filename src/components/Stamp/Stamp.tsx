import { StampType } from "../../App";
import "./Stamp.scss";
import { useState, useRef } from "react";
import { FaRotateRight, FaRegTrashCan } from "react-icons/fa6";
import useDrag from "../../hooks/useDrag";
import useRotate from "../../hooks/useRotate";
import useResize from "../../hooks/useResize";

type StampComponentType = {
	data: StampType;
	onDeleteClick: (id: string) => void;
	updateStamp: (updatedStamp: StampType) => void;
	docSectionRef: React.RefObject<HTMLElement | null>;
	scrollRef: React.RefObject<number>;
};

export default function Stamp({
	data,
	onDeleteClick,
	updateStamp,
	docSectionRef,
	scrollRef,
}: StampComponentType) {
	const { id, top, left, url, width, height, rotate } = data;

	const [isShowing, setIsShowing] = useState(false);

	const resizableRef = useRef<HTMLDivElement | null>(null);
	const resizeTopLeftRef = useRef<HTMLSpanElement | null>(null);
	const resizeBottomLeftRef = useRef<HTMLSpanElement | null>(null);
	const resizeTopRightRef = useRef<HTMLSpanElement | null>(null);
	const resizeBottomRightRef = useRef<HTMLSpanElement | null>(null);

	const {
		handleMouseDown,
		handleMouseUp,
		startXRef,
		startYRef,
		initialXRef,
		initialYRef,
	} = useDrag(data, resizableRef, updateStamp, docSectionRef, scrollRef);

	const rotateMouseDown = useRotate(data, resizableRef, updateStamp);
	useResize(
		data,
		resizableRef,
		resizeTopLeftRef,
		resizeBottomLeftRef,
		resizeTopRightRef,
		resizeBottomRightRef,
		updateStamp,
		docSectionRef,
		scrollRef
	);

	const handleClick = (e: React.MouseEvent) => {
		const el = e.target as HTMLElement;
		if (
			!el.classList.contains("stamp") ||
			initialXRef.current !== startXRef.current ||
			initialYRef.current !== startYRef.current
		) {
			return;
		}
		setIsShowing((prev: boolean) => !prev);
	};

	return (
		<>
			{isShowing ? (
				<div
					ref={resizableRef}
					className="dragable-box"
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
					onClick={handleClick}
					style={{
						position: "absolute",
						top,
						left,
						width,
						height,
						transform: `rotate(${rotate}deg)`,
					}}
				>
					<FaRotateRight className="rotate-btn" onMouseDown={rotateMouseDown} />

					<div className="delete-btn_wrapper" onClick={() => onDeleteClick(id)}>
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