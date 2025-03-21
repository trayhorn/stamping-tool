import { useRef } from "react";
import { StampType } from "../App";

export default function useRotate(
	data: StampType,
	ref: React.RefObject<HTMLElement | null>,
	updateStamp: (stamp: StampType) => void,
) {
  const centerRef = useRef({ x: 0, y: 0 });

	const rotateMouseDown = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (ref.current) {
			const elRect = ref.current.getBoundingClientRect();

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

		if (ref.current) {
			ref.current.style.transform = `rotate(${convertedAngle}deg)`;
		}
	};

	const rotateMouseUp = (e: MouseEvent) => {
		const angle = Math.atan2(
			e.pageY - centerRef.current.y,
			e.pageX - centerRef.current.x
		);
		const convertedAngle = ((angle * 180) / Math.PI + 90 + 360) % 360;

		if (ref.current) {
			console.log("updating stamp in rotateMouseUp");
			updateStamp({
				...data,
				rotate: convertedAngle,
			});
		}

		document.removeEventListener("mousemove", rotateMouseMove);
		document.removeEventListener("mouseup", rotateMouseUp);
	};

	return rotateMouseDown;
}