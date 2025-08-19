import "./Header.scss";
import { DownloadIcon, SaveIcon } from "../utils/icons";
import { useTranslation } from "react-i18next";

type Header = {
	file: File;
	urlToDownload: string;
	clearFile: () => void;
	clearFileUrl: () => void;
	clearStamps: () => void;
	saveDocument: () => void;
};

export default function Header({
	file,
	urlToDownload,
	clearFile,
	clearFileUrl,
	clearStamps,
	saveDocument,
}: Header) {
	const { t } = useTranslation();

	const handleCancelClick = () => {
		clearFileUrl();
		clearFile();
		clearStamps();
	};

	const fileName = file.name.slice(0, file.name.length - 4) + "-edited.pdf";

	return (
		<header className="header">
			<nav className="nav">
				<p className="document_title">{file.name}</p>
				<div className="buttons-container">
					<button className="button secondary" onClick={handleCancelClick}>
						{t("Cancel")}
					</button>
					<button
						className="download_button"
						disabled={urlToDownload ? false : true}
					>
						<a href={urlToDownload} download={fileName} className="primary">
							<DownloadIcon />
							{t("Download PDF")}
						</a>
					</button>
					<button className="button primary" onClick={saveDocument}>
						<SaveIcon />
						{t("Save")}
					</button>
				</div>
			</nav>
		</header>
	);
}