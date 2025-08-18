import "./FilePreview.scss";
import { Document, Thumbnail } from "react-pdf";
import { useTranslation } from "react-i18next";

type FilePreview = {
	file: File;
	numPages: number | undefined;
	handleItemClick: (num: number) => void;
};


export default function FilePreview({
	file,
	numPages,
	handleItemClick,
}: FilePreview) {
	const { t } = useTranslation();

	return (
		<div className="sidebar sidebar-preview">
			<h2 className="heading">{t("Preview")}</h2>
			<Document
				className="thumbnail-document"
				file={file}
			>
				{[...Array(numPages)].map((_, i) => {
					return (
						<Thumbnail
							key={i}
							height={289}
							className="thumbnail"
							pageNumber={i + 1}
							onItemClick={({ pageNumber }) => handleItemClick(pageNumber)}
						/>
					);
				})}
			</Document>
		</div>
	);
}