import "./FilePreview.scss";
import { Document, Thumbnail } from "react-pdf";

type FilePreview = {
	file: File;
	onLoadSuccess: ({ numPages }: { numPages: number }) => void;
	numPages: number | undefined;
  onItemClick: (num: number) => void;
};


export default function FilePreview({ file, onLoadSuccess, numPages, onItemClick }: FilePreview) {
	return (
		<div className="sidebar sidebar-preview">
			<h2 className="heading">Preview</h2>
			<Document
				className="thumbnail-document"
				file={file}
				onLoadSuccess={onLoadSuccess}
			>
				{[...Array(numPages)].map((_, i) => {
					return (
						<Thumbnail
							key={i}
							width={205}
							className="thumbnail"
							pageNumber={i + 1}
							onItemClick={({ pageNumber }) => onItemClick(pageNumber)}
						/>
					);
				})}
			</Document>
		</div>
	);
}