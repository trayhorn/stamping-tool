import "./Header.scss";
import { DownloadIcon, SaveIcon } from "../utils/icons";
import { useEffect, useState } from "react";

type Header = {
	file: File;
	clearFile: () => void;
};

export default function Header({ file, clearFile }: Header) {
	const [fileUrl, setFileUrl] = useState<string>("");

	const randomId = crypto.randomUUID();

	useEffect(() => {
		setFileUrl(window.URL.createObjectURL(file));
	}, [file]);

	return (
		<header className="header">
			<nav className="nav">
				<p className="document_title">{file.name}</p>
				<div className="buttons-container">
					<button className="button secondary" onClick={clearFile}>
						Cancel
					</button>
					<a href={fileUrl} download={randomId + ".pdf"} className="button primary">
						<DownloadIcon />
						Download PDF
					</a>
					<button className="button primary">
						<SaveIcon />
						Save and Close
					</button>
				</div>
			</nav>
		</header>
	);
}