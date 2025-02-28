import { useEffect, useRef } from "react";
import "./StampsBox.scss";

export default function StampsBox() {

	const containerRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const container = containerRef.current;

		let startX: number = 0;
		let startY: number = 0;
		let newX: number = 0;
		let newY: number = 0;

		let clone: HTMLElement | null = null;

		const handleMouseDown = (e: MouseEvent) => {
			const el = e.target as HTMLElement;
			if (!el?.classList.contains("stamp")) {
				return;
			}

			startX = e.clientX;
			startY = e.clientY;

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);

			clone = el.cloneNode(true) as HTMLElement;
			clone.classList.add("clone");

			if (el.parentElement) {
				console.log(el.parentElement.getBoundingClientRect());
				clone.style.top = `${el.parentElement.offsetTop}px`;
				clone.style.left = `${el.parentElement.offsetLeft}px`;
			}

			container?.appendChild(clone);
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (!clone) return;

			newX = startX - e.clientX;
			newY = startY - e.clientY;

			startX = e.clientX;
			startY = e.clientY;

			clone.style.top = `${clone.offsetTop - newY}px`;
			clone.style.left = `${clone.offsetLeft - newX}px`;
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		container?.addEventListener('mousedown', handleMouseDown);

		return () => {
			container?.removeEventListener('mousedown', handleMouseDown);
		}
	}, [])


  return (
		<div className="sidebar">
			<h2 className="heading">Stamps</h2>
			<div className="stamps-list" ref={containerRef}>
				<div className="stamp-item">
					<img
						draggable="false"
						className="stamp"
						src="/public/images/AttachmentDateStamp-55mmx55mm-300dpi.png"
						alt="stamp_1"
					/>
				</div>
				<div className="stamp-item">
					<img
						draggable="false"
						className="stamp"
						src="/public/images/ChamberStamp-55mmx55mm-300dpi.png"
						alt="stamp_2"
					/>
				</div>
				<div className="stamp-item">
					<img
						draggable="false"
						className="stamp"
						src="/public/images/Notary_55x55canvas300dpi.png"
						alt="stamp_3"
					/>
				</div>
			</div>
		</div>
	);
}