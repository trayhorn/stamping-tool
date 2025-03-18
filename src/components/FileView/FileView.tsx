import "./FileView.scss";
import { Document, Page } from "react-pdf";
import { PDFDocument } from "pdf-lib";
import { useEffect } from "react";
import Stamp from "../Stamp/Stamp";
import { StampType } from "../../App";

type FileView = {
	file: File;
	pdfBlob: Blob | null;
	passPdfBlob: (blob: Blob) => void;
	pdfDocRef: React.RefObject<PDFDocument | null>;
	stamps: Record<number, StampType[]>;
	onLoadSuccess: ({ numPages }: { numPages: number }) => void;
	pageNum: number;
	deleteStamp: (id: string) => void;
	updateStamp: (updatedStamp: StampType) => void;
};

export default function FileView({
	file,
	pdfBlob,
	passPdfBlob,
	pdfDocRef,
	stamps,
	onLoadSuccess,
	pageNum,
	deleteStamp,
	updateStamp,
}: FileView) {

	useEffect(() => {
		async function renderPdf() {
			const existingPdfBytes = await file.arrayBuffer();
			pdfDocRef.current = await PDFDocument.load(existingPdfBytes);
			const pdfBytes = await pdfDocRef.current.save();
			const blob = new Blob([pdfBytes], { type: "application/pdf" });

			passPdfBlob(blob);
		}

		renderPdf();
	}, [file, passPdfBlob, pdfDocRef]);

	const handleStampClick = (id: string): void => {
		deleteStamp(id);
	};

	return (
		<section className="document-section">
			<Document file={pdfBlob} onLoadSuccess={onLoadSuccess}>
				<Page
					className="page"
					height={942}
					renderTextLayer={false}
					renderAnnotationLayer={false}
					pageNumber={pageNum}
				/>
				{stamps[pageNum] &&
					stamps[pageNum].map((el, i) => {
						return (
							<Stamp
								key={i}
								data={el}
								onDeleteClick={handleStampClick}
								updateStamp={updateStamp}
							/>
						);
					})}
			</Document>
		</section>
	);
}
