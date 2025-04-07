import { useRef } from "react";
import "./StampsBox.scss";
import { StampType } from "../../App";
import { FiPlus } from "react-icons/fi";

type StampsBox = {
	handleSetStamps: (newStamp: StampType) => void;
	openModal: () => void;
	scrollRef: React.RefObject<number>;
};

export default function StampsBox({ handleSetStamps, openModal, scrollRef }: StampsBox) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const cloneRef = useRef<HTMLElement | null>(null);

	const startXRef = useRef(0);
	const startYRef = useRef(0);
	const newXRef = useRef(0);
	const newYRef = useRef(0);

	const handleMouseDown = (e: React.MouseEvent) => {
		const el = e.target as HTMLElement;
		if (!el?.classList.contains("stamp")) {
			return;
		}

		startXRef.current = e.clientX;
		startYRef.current = e.clientY;

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		cloneRef.current = el.cloneNode(true) as HTMLElement;
		cloneRef.current.classList.add("clone");

		if (el.parentElement) {
			cloneRef.current.style.top = `${el.parentElement.offsetTop}px`;
			cloneRef.current.style.left = `${el.parentElement.offsetLeft}px`;
		}

		containerRef.current?.appendChild(cloneRef.current);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!cloneRef.current) return;

		newXRef.current = startXRef.current - e.clientX;
		newYRef.current = startYRef.current - e.clientY;

		startXRef.current = e.clientX;
		startYRef.current = e.clientY;

		cloneRef.current.style.top = `${cloneRef.current.offsetTop - newYRef.current}px`;
		cloneRef.current.style.left = `${cloneRef.current.offsetLeft - newXRef.current}px`;
	};

	const handleMouseUp = (e: MouseEvent) => {
		const documentPage = document.querySelector('.document-section');
		const pdfPage = document.querySelector(
			".react-pdf__Page__canvas"
		) as HTMLCanvasElement | null;
		const clone = e.target as HTMLElement | null;

		if (!pdfPage || !clone || !documentPage) return;

		const docRect = documentPage?.getBoundingClientRect();
		const pageRect = pdfPage.getBoundingClientRect();
		const cloneRect = clone.getBoundingClientRect();

		if (cloneRect.top > pageRect.top && cloneRect.left > pageRect.left - 25) {
			const newStamp = {
				id: crypto.randomUUID(),
				top: cloneRect.top - docRect.top + scrollRef.current,
				left: cloneRect.left - docRect.left,
				url: clone.getAttribute("src") || "",
				width: 100,
				height: 100,
				rotate: 0,
			};

			handleSetStamps(newStamp);
		}

		clone.remove();

		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	};

	return (
		<div className="sidebar">
			<h2 className="heading">Stamps</h2>
			<div
				className="stamps-list"
				ref={containerRef}
				onMouseDown={handleMouseDown}
			>
				<div className="stamp-item">
					<img
						draggable="false"
						className="stamp"
						src="/images/Stamp4.png"
						alt="stamp_1"
					/>
				</div>
				<div className="stamp-item">
					<img
						draggable="false"
						className="stamp"
						src="/images/Stamp6.png"
						alt="stamp_2"
					/>
				</div>
				<div className="stamp-item">
					<img
						draggable="false"
						className="stamp"
						src="/images/Stamp7.png"
						alt="stamp_3"
					/>
				</div>
				<div className="stamp-item add-stamp_container" onClick={openModal}>
					<FiPlus className="add-stamp_icon" size="2rem" />
				</div>
			</div>
		</div>
	);
}