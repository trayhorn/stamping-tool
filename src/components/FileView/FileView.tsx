import "./FileView.scss";
import { Document, Page } from "react-pdf";
import { PDFDocument } from "pdf-lib";
import { useEffect, useState, useRef } from "react";
import Stamp from "../Stamp/Stamp";
import { StampType } from "../../App";

type FileView = {
	file: File;
	stamps: Record<number, StampType[]>;
	onLoadSuccess: ({ numPages }: { numPages: number }) => void;
	pageNum: number;
	numPages: number | undefined;
	setFileUrl: (data: string) => void;
	clearStamps: () => void;
	deleteStamp: (id: string) => void;
};

export default function PageView({
	file,
	stamps,
	onLoadSuccess,
	pageNum,
	numPages,
	setFileUrl,
	clearStamps,
	deleteStamp,
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

	const embedStamp = async (
		{ top, left, url }: StampType,
		pageNumber: number
	) => {
		if (!pdfDocRef.current) return;

		const pngImageBytes = await fetch(url).then((res) => res.arrayBuffer());

		const pngImage = await pdfDocRef.current.embedPng(pngImageBytes);
		const currentPage = pdfDocRef.current.getPages()[pageNumber];

		currentPage.drawImage(pngImage, {
			x: left - 240 - 30,
			y: 942 - top + 76.6 - 150,
			width: 100,
			height: 100,
		});
	};

	const saveDocument = async () => {
		if (pdfDocRef.current) {
			await Promise.all(
				[...Array(numPages)].map((_, i) => {
					if (stamps[i + 1]) {
						return Promise.all(
							stamps[i + 1].map(async (el) => {
								return embedStamp(el, i);
							})
						);
					}
				})
			);

			const pdfBytes = await pdfDocRef.current.save();
			const newBlob = new Blob([pdfBytes], { type: "application/pdf" });

			pdfDocRef.current = await PDFDocument.load(pdfBytes);
			setPdfBlob(newBlob);

			setFileUrl(URL.createObjectURL(newBlob));
			clearStamps();
		}
	};

	const handleStampClick = (id: string): void => {
		deleteStamp(id);
	};

	return (
		<section className="document-section">
			<button onClick={saveDocument}>Save</button>
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
								onClick={handleStampClick}
							/>
						);
					})}
			</Document>
		</section>
	);
}
