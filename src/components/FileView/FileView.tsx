import "./FileView.scss";
import { Document, Page } from "react-pdf";
import { PDFDocument } from "pdf-lib";
import { useEffect, useState, useRef } from "react";

type stampCoordinates = {
	stampTop: number | undefined;
	stampLeft: number | undefined;
};

type FileView = {
	file: File;
	onLoadSuccess: ({ numPages }: { numPages: number }) => void;
	pageNum: number;
	stampCoordinates: stampCoordinates;
	stampImageUrl: string
};

export default function PageView({
	file,
	onLoadSuccess,
	pageNum,
	stampCoordinates,
	stampImageUrl,
}: FileView) {

	const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

	const pdfDocRef = useRef<PDFDocument | null>(null);

	useEffect(() => {
		async function renderPdf() {

			const existingPdfBytes = await file.arrayBuffer();
			pdfDocRef.current = await PDFDocument.load(existingPdfBytes);
			const pdfBytes = await pdfDocRef.current.save();
			const blob = new Blob([pdfBytes], { type: "application/pdf" });

			setPdfBlob(blob);
		}

		renderPdf();
	}, [file]);

	useEffect(() => {
		if (!stampCoordinates.stampLeft && !stampCoordinates.stampTop) {
			return;
		}

		async function embedImage(left: number | undefined, top: number | undefined) {
			if (!pdfDocRef.current) return;

			const pngImageBytes = await fetch(stampImageUrl).then((res) =>
				res.arrayBuffer()
			);

			const pngImage = await pdfDocRef.current.embedPng(pngImageBytes);
			const currentPage = pdfDocRef.current.getPages()[pageNum - 1];

			if (top && left) {
				currentPage.drawImage(pngImage, {
					x: left - 30,
					y: 942 - top - 150,
					width: 100,
					height: 100,
				});
			}

			// Approach when saving after each stamp

			// const pdfBytes = await pdfDocRef.current.save();
			// const newBlob = new Blob([pdfBytes], { type: "application/pdf" });

			// pdfDocRef.current = await PDFDocument.load(pdfBytes);
			// setPdfBlob(newBlob);
		}

		embedImage(stampCoordinates.stampLeft, stampCoordinates.stampTop);
	}, [stampImageUrl, pageNum, stampCoordinates]);

	// Approach when saving all changes at once

	const saveDocument = async () => {
		if (pdfDocRef.current) {
			const pdfBytes = await pdfDocRef.current.save();
			const newBlob = new Blob([pdfBytes], { type: "application/pdf" });

			pdfDocRef.current = await PDFDocument.load(pdfBytes);
			setPdfBlob(newBlob);

			document.querySelectorAll(".clone").forEach((el) => el.remove());
		}
	}

	return (
		<section className="document-section">
			<button onClick={() => saveDocument()}>Save</button>
			<Document file={pdfBlob} onLoadSuccess={onLoadSuccess}>
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