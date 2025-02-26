import "./Header.scss";
import { DownloadIcon, SaveIcon } from "../utils/icons";

type Header = {
	filename: string;
};

export default function Header({filename}: Header)  {
  return (
		<header className="header">
			<nav className="nav">
				<p className="document_title">{filename}</p>
				<div className="buttons-container">
					<button className="button secondary">Cancel</button>
					<button className="button primary">
						<DownloadIcon />
						Download PDF
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