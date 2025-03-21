import { useRef } from "react";
import { StampType } from "../App";
import calculateCoordinates from "../components/utils/calculateCoordinates";


export default function useDrag(
	data: StampType,
	ref: React.RefObject<HTMLElement | null>,
	updateStamp: (stamp: StampType) => void
) {
	const { width, height, rotate } = data;

	const startXRef = useRef(0);
	const startYRef = useRef(0);
	const initialXRef = useRef(0);
	const initialYRef = useRef(0);

	let newX = 0;
  let newY = 0;


	const handleMouseDown = (e: React.MouseEvent) => {
		console.log("calling dragdown");
		startXRef.current = e.clientX;
		startYRef.current = e.clientY;

		initialXRef.current = e.clientX;
		initialYRef.current = e.clientY;

		document.addEventListener("mousemove", handleMouseMove);
	};

	const handleMouseMove = (e: MouseEvent) => {
		newX = startXRef.current - e.clientX;
		newY = startYRef.current - e.clientY;

		startXRef.current = e.clientX;
		startYRef.current = e.clientY;

		if (ref.current) {
			ref.current.style.top = ref.current.offsetTop - newY + "px";
			ref.current.style.left = ref.current.offsetLeft - newX + "px";
		}
	};

	const handleMouseUp = (e: React.MouseEvent) => {
		const resizableEl = ref.current;
		const el = e.target as HTMLElement;

		document.removeEventListener("mousemove", handleMouseMove);

		if (!resizableEl) return;
		if (el.classList.contains("rotate-btn")) return;
		if (
			initialXRef.current === startXRef.current &&
			initialYRef.current === startYRef.current
		)
			return;

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
	};

	return { handleMouseDown, handleMouseUp, startXRef, startYRef, initialXRef, initialYRef };
}