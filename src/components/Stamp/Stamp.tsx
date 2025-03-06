import { StampType } from "../../App";
import "./Stamp.scss";

type StampComponentType = {
	data: StampType;
	onClick: (id: string) => void;
}

export default function Stamp({ data, onClick }: StampComponentType) {
	const { id, top, left, url } = data;

	return (
		// <div className="stamp-container active">
		<img
			onClick={() => onClick(id)}
			style={{ top, left }}
			draggable="false"
			className="stamp clone"
			src={url}
			alt="stamp_1"
		/>
		// </div>
	);
}
