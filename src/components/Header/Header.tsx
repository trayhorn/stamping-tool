import "./Header.scss";
import { DownloadIcon, SaveIcon } from "../utils/icons";

export default function Header() {
  return (
		<header className="header">
			<nav className="nav">
				<p className="document_title">
					Certificate of Origin – AW-156415645184
				</p>
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