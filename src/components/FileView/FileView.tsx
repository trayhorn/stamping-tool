import "./FileView.scss";
import { Document, Page } from "react-pdf";
import { PDFDocument } from "pdf-lib";
import { useEffect, useState } from "react";

type stampCoordinates = {
	stampTop: number | undefined;
	stampLeft: number | undefined;
};

type FileView = {
	file: File;
	onLoadSuccess: ({ numPages }: { numPages: number }) => void;
	pageNum: number;
	stampCoordinates: stampCoordinates;
};

export default function PageView({
	file,
	onLoadSuccess,
	pageNum,
	stampCoordinates,
}: FileView) {
	const [pdf, setPdf] = useState<string | null>(null);

	useEffect(() => {
		async function renderPdf() {
			const existingPdfBytes = await file.arrayBuffer();

			const pdfDoc = await PDFDocument.load(existingPdfBytes);

			const pdfBytes = await pdfDoc.save();

			const blob = new Blob([pdfBytes], { type: "application/pdf" });
			const blobUrl = URL.createObjectURL(blob);

			setPdf(blobUrl);
		}

		renderPdf();
	}, [file]);

	useEffect(() => {
		if (!stampCoordinates.stampLeft && !stampCoordinates.stampTop) {
			return;
		}

		async function embedImage(left: number | undefined, top: number | undefined) {
			const pngUrl = "/public/images/ChamberStamp-55mmx55mm-300dpi.png";

			const pngImageBytes = await fetch(pngUrl).then((res) =>
				res.arrayBuffer()
			);

			const existingPdfBytes = await file.arrayBuffer();
			const pdfDoc = await PDFDocument.load(existingPdfBytes);

			const pngImage = await pdfDoc.embedPng(pngImageBytes);
			const firstPage = pdfDoc.getPages()[0];

			firstPage.drawImage(pngImage, {
				x: left,
				y: top,
				width: 100,
				height: 100,
			});

			const pdfBytes = await pdfDoc.save();

			const blob = new Blob([pdfBytes], { type: "application/pdf" });
			const blobUrl = URL.createObjectURL(blob);

			setPdf(blobUrl);
		}

		embedImage(stampCoordinates.stampLeft, stampCoordinates.stampTop);
	}, [stampCoordinates.stampLeft, stampCoordinates.stampTop, file]);

	return (
		<section className="document-section">
			<Document file={pdf} onLoadSuccess={onLoadSuccess}>
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