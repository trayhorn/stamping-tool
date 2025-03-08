import { StampType } from "../../App";
import "./Stamp.scss";
import { useRef } from "react";
// import { ResizableBox } from "react-resizable";


type StampComponentType = {
	data: StampType;
	onClick: (id: string) => void;
	updateStampPosition: (updatedStamp: StampType) => void;
};

export default function Stamp({ data, onClick, updateStampPosition }: StampComponentType) {
	const { id, top, left, url } = data;
	const stampRef = useRef<HTMLImageElement | null>(null);

	// const [isShowing, setIsShowing] = useState(false);
	

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
			};

			updateStampPosition(updatedStamp);
		}

		document.removeEventListener("mousemove", handleMouseMove);
	};

	return (
		<>
			{/* {isShowing ? (
				<ResizableBox
					className="box"
					width={100}
					height={100}
					style={{ top, left }}
				>
					<img
						ref={stampRef}
						onMouseDown={handleMouseDown}
						onMouseUp={handleMouseUp}
						onClick={() => setIsShowing((prev: boolean) => !prev)}
						onDoubleClick={() => onClick(id)}
						style={{ width: "100%" }}
						draggable="false"
						className="stamp clone"
						src={url}
						alt="stamp_1"
					/>
				</ResizableBox>
			) : (
				<img
					ref={stampRef}
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
					onClick={() => setIsShowing((prev: boolean) => !prev)}
					onDoubleClick={() => onClick(id)}
					style={{ top, left }}
					draggable="false"
					className="stamp clone"
					src={url}
					alt="stamp_1"
				/>
			)} */}
			<img
				ref={stampRef}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onDoubleClick={() => onClick(id)}
				style={{ top, left }}
				draggable="false"
				className="stamp clone"
				src={url}
				alt="stamp_1"
			/>
		</>
	);
}
