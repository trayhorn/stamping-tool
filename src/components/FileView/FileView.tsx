import "./FileView.scss";
import { Document, Page } from "react-pdf";

type FileView = {
  file: File;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  pageNum: number;
}

export default function PageView({ file, onLoadSuccess, pageNum }: FileView) {
	return (
		<section className="document-section">
			<Document file={file} onLoadSuccess={onLoadSuccess}>
				<Page
					className="page"
					height={942}
					renderTextLayer={false}
					renderAnnotationLayer={false}
					pageNumber={pageNum}
				/>
			</Document>
		</section>
	);
}