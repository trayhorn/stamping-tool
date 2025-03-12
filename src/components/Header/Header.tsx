import "./Header.scss";
import { DownloadIcon, SaveIcon } from "../utils/icons";

type Header = {
	file: File;
	urlToDownload: string;
	clearFile: () => void;
	clearFileUrl: () => void;
	saveDocument: () => void;
};

export default function Header({
	file,
	urlToDownload,
	clearFile,
	clearFileUrl,
	saveDocument,
}: Header) {
	const handleClick = () => {
		clearFileUrl();
		clearFile();
	};

	const fileName = file.name.slice(0, file.name.length - 4) + "-edited.pdf";

	return (
		<header className="header">
			<nav className="nav">
				<p className="document_title">{file.name}</p>
				<div className="buttons-container">
					<button className="button secondary" onClick={handleClick}>
						Cancel
					</button>
					<button
						className="download_button"
						disabled={urlToDownload ? false : true}
					>
						<a href={urlToDownload} download={fileName} className="primary">
							<DownloadIcon />
							Download PDF
						</a>
					</button>
					<button className="button primary" onClick={saveDocument}>
						<SaveIcon />
						Save
					</button>
				</div>
			</nav>
		</header>
	);
}