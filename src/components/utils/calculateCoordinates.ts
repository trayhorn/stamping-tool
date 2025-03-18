
type ParamsType = {
	newTop: number;
	newLeft: number;
	transform: string;
	width: number;
	height: number;
}

type Result = {
	initialLeft: number;
	initialTop: number;
};

export default function calculateCoordinates(params: ParamsType): Result {
	const { newTop, newLeft, transform, width, height } = params;

	let angle = 0;

	if (transform !== "none") {
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

	return { initialLeft, initialTop };
}
