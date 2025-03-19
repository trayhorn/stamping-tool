import { ChangeEvent, useState, useRef, useCallback } from "react";
import "./App.scss";
import Header from "./components/Header/Header";
import { pdfjs } from "react-pdf";
import { degrees } from 'pdf-lib';
import FileForm from "./components/FileForm/FileForm";
import FileView from "./components/FileView/FileView";
import FilePreview from "./components/FilePreview/FilePreview";
import StampsBox from "./components/StampsBox/StampsBox";
import { createPortal } from "react-dom";
import Modal from "./components/Modal/Modal";
import { PDFDocument } from "pdf-lib";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url
).toString();

export type StampCoordinate = number | undefined;
export type StampType = {
	id: string;
	top: number;
	left: number;
	url: string;
	width: number;
	height: number;
	rotate: number;
};

function App() {
	const [file, setFile] = useState<File | null>(null);
	const [fileUrl, setFileUrl] = useState<string>("");
	const [numPages, setNumPages] = useState<number>();
	const [pageNum, setPageNum] = useState<number>(1);
	const [stamps, setStamps] = useState<Record<number, StampType[]>>({});
	const [isModalShowing, setIsModalShowing] = useState(false);
	const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

	const pdfDocRef = useRef<PDFDocument | null>(null);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
		setNumPages(numPages);
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleSetStamps = (newStamp: StampType) => {
		setStamps((prev) => ({
			...prev,
			[pageNum]: [...(prev[pageNum] || []), newStamp],
		}));
	};

	const deleteStamp = (id: string) => {
		setStamps((prev) => {
			return {
				...prev,
				[pageNum]: stamps[pageNum].filter((el) => el.id !== id),
			};
		});
	};

	const updateStamp = (updatedStamp: StampType) => {
		const index = stamps[pageNum].findIndex((el) => el.id === updatedStamp.id);

		setStamps((prev) => {
			return {
				...prev,
				[pageNum]: prev[pageNum].map((stamp, i) =>
					i === index ? updatedStamp : stamp
				),
			};
		});
	};

	const handleBlobUpdate = useCallback((blob: Blob): void => {
		setPdfBlob(blob);
	}, []);

	const embedStamp = async (
		{ top, left, url, width, height, rotate }: StampType,
		pageNumber: number
	) => {
		if (!pdfDocRef.current) return;

		const pdfPageRect = document
			.querySelector(".react-pdf__Page__canvas")
			?.getBoundingClientRect();

		const pngImageBytes = await fetch(url).then((res) => res.arrayBuffer());

		const pngImage = await pdfDocRef.current.embedPng(pngImageBytes);
		const currentPage = pdfDocRef.current.getPages()[pageNumber];

		

		const radians = (rotate * Math.PI) / 180;
		const offsetX =
			(width / 2) * (1 - Math.cos(radians)) - (height / 2) * Math.sin(radians);
		const offsetY =
			(height / 2) * (1 - Math.cos(radians)) + (width / 2) * Math.sin(radians);

		if (pdfPageRect) {
			currentPage.drawImage(pngImage, {
				x: left - pdfPageRect.left + offsetX,
				y: currentPage.getHeight() - (top - 102.4) - width + offsetY,
				width,
				height,
				rotate: degrees(360 - rotate),
			});
		}
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
			setStamps({});
		}
	};

	return (
		<>
			{!file && (
				<FileForm
					onChange={handleChange}
					onDrop={(file: File) => setFile(file)}
				/>
			)}

			{file && (
				<>
					<Header
						file={file}
						urlToDownload={fileUrl}
						clearFile={() => setFile(null)}
						clearFileUrl={() => setFileUrl("")}
						saveDocument={saveDocument}
					/>

					<main>
						<StampsBox
							handleSetStamps={handleSetStamps}
							openModal={() => setIsModalShowing(true)}
						/>
						<FileView
							file={file}
							pdfBlob={pdfBlob}
							passPdfBlob={handleBlobUpdate}
							pdfDocRef={pdfDocRef}
							stamps={stamps}
							onLoadSuccess={onDocumentLoadSuccess}
							pageNum={pageNum}
							deleteStamp={deleteStamp}
							updateStamp={updateStamp}
						/>
						<FilePreview
							file={file}
							onLoadSuccess={onDocumentLoadSuccess}
							numPages={numPages}
							handleItemClick={(num) => setPageNum(num)}
						/>
					</main>
				</>
			)}
			{isModalShowing &&
				createPortal(
					<Modal closeModal={() => setIsModalShowing(false)} />,
					document.body
				)}
		</>
	);
}

export default App;
