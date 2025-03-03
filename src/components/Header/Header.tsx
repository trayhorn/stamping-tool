import "./Header.scss";
import { DownloadIcon, SaveIcon } from "../utils/icons";

type Header = {
	file: File;
	urlToDownload: string;
	clearFile: () => void;
};

export default function Header({ file, urlToDownload, clearFile }: Header) {
	const randomId = crypto.randomUUID();

	return (
		<header className="header">
			<nav className="nav">
				<p className="document_title">{file.name}</p>
				<div className="buttons-container">
					<button className="button secondary" onClick={clearFile}>
						Cancel
					</button>
					<button className="download_button" disabled={urlToDownload ? false : true}>
						<a
							href={urlToDownload}
							download={randomId + ".pdf"}
							className="primary"
						>
							<DownloadIcon />
							Download PDF
						</a>
					</button>
					<button className="button primary">
						<SaveIcon />
						Save and Close
					</button>
				</div>
			</nav>
		</header>
	);
}