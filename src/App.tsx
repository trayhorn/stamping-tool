import { ChangeEvent, useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { pdfjs } from "react-pdf";
import { PDFDocument, degrees } from 'pdf-lib';
import { useModal } from "./hooks/useModal";
import Header from "./components/Header/Header";
import FileForm from "./components/FileForm/FileForm";
import FileView from "./components/FileView/FileView";
import FilePreview from "./components/FilePreview/FilePreview";
import StampsBox from "./components/StampsBox/StampsBox";
import Modal from "./components/Modal/Modal";
import "./App.scss";


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

export type StampImg = {
	_id: string;
	stamp: string;
	url: string;
};

function App() {
	const [file, setFile] = useState<File | null>(null);
	const [fileUrl, setFileUrl] = useState<string>("");
	const [numPages, setNumPages] = useState<number>();
	const [pageNum, setPageNum] = useState<number>(1);
	const [stamps, setStamps] = useState<Record<number, StampType[]>>({});
	const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
	const [stampsImgs, setStampsImgs] = useState<StampImg[]>([]);
	const { isModalShowing, openModal, closeModal } = useModal();

	const pdfDocRef = useRef<PDFDocument | null>(null);
	const scrollRef = useRef<number>(0);

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

	const handleAddStampImage = (newStamp: StampImg) => {
		setStampsImgs((prev) => [...prev, newStamp]);
	};

	const handleSetStampImages = useCallback((result: StampImg[]) => {
		setStampsImgs(result);
	}, []);

	const embedStamp = async (
		{ top, left, url, width, height, rotate }: StampType,
		pageNumber: number
	) => {
		if (!pdfDocRef.current) return;

		const canvasScale = 1.1187648456057007;

		const docRect = document
			.querySelector('.document-section')
			?.getBoundingClientRect();

		const canvasRect = document
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

		if (canvasRect && docRect) {
			const canvasTop = Math.max(docRect.top, canvasRect.top);
			currentPage.drawImage(pngImage, {
				x: (left - (canvasRect.left - docRect.left) + offsetX) / canvasScale,
				y: (currentPage.getHeight() -
						(top - (canvasTop - docRect.top) - 150) -
						height + offsetY) / canvasScale,
				width: width / canvasScale,
				height: height / canvasScale,
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
								console.log(el);
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

	useEffect(() => {
		async function renderPdf() {
			if (!file) return;
			const existingPdfBytes = await file.arrayBuffer();
			pdfDocRef.current = await PDFDocument.load(existingPdfBytes);
			const pdfBytes = await pdfDocRef.current.save();
			const blob = new Blob([pdfBytes], { type: "application/pdf" });

			setPdfBlob(blob);
		}

		renderPdf();
	}, [file, pdfDocRef]);

	return (
		<>
			{file ? (
				<>
					<Header
						file={file}
						urlToDownload={fileUrl}
						clearFile={() => setFile(null)}
						clearFileUrl={() => setFileUrl("")}
						clearStamps={() => setStamps({})}
						saveDocument={saveDocument}
					/>

					<main>
						<StampsBox
							stampsImgs={stampsImgs}
							updateStampsImgs={handleSetStampImages}
							handleSetStamps={handleSetStamps}
							openModal={openModal}
							scrollRef={scrollRef}
						/>
						<FileView
							pdfBlob={pdfBlob}
							stamps={stamps}
							onLoadSuccess={onDocumentLoadSuccess}
							pageNum={pageNum}
							deleteStamp={deleteStamp}
							updateStamp={updateStamp}
							scrollRef={scrollRef}
						/>
						<FilePreview
							file={file}
							numPages={numPages}
							handleItemClick={(num) => setPageNum(num)}
						/>
					</main>
				</>
			) : (
				<FileForm
					onChange={handleChange}
					onDrop={(file: File) => setFile(file)}
				/>
			)}
			{isModalShowing &&
				createPortal(
					<Modal
						closeModal={closeModal}
						addStampImage={handleAddStampImage}
					/>,
					document.body
				)}
		</>
	);
}

export default App;