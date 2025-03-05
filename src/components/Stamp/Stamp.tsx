import { StampType } from "../../App";
import "./Stamp.scss";

export default function Stamp({ top, left, url }: StampType) {
	return (
		<img
			style={{ top, left }}
			draggable="false"
			className="stamp clone"
			src={url}
			alt="stamp_1"
		/>
	);
}
