import "./FilePreview.scss";
import { Document, Thumbnail } from "react-pdf";

type FilePreview = {
	file: File;
	onLoadSuccess: ({ numPages }: { numPages: number }) => void;
	numPages: number | undefined;
	handleItemClick: (num: number) => void;
};


export default function FilePreview({
	file,
	numPages,
	handleItemClick,
}: FilePreview) {
	return (
		<div className="sidebar sidebar-preview">
			<h2 className="heading">Preview</h2>
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