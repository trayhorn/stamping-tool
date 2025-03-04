import { ChangeEvent, useState } from "react";
import './App.scss';
import Header from './components/Header/Header';
import { pdfjs } from "react-pdf";
import FileForm from "./components/FileForm/FileForm";
import FileView from "./components/FileView/FileView";
import FilePreview from "./components/FilePreview/FilePreview";
import StampsBox from "./components/StampsBox/StampsBox";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url
).toString();

export type StampCoordinate = number | undefined;
export type Stamp = {
	top: number;
	left: number;
	url: string;
}

function App() {
	const [file, setFile] = useState<File | null>(null);
	const [fileUrl, setFileUrl] = useState<string>('');

  const [numPages, setNumPages] = useState<number>();
	const [pageNum, setPageNum] = useState<number>(1);

	const [stampTop, setStampTop] = useState<StampCoordinate>(undefined);
	const [stampLeft, setStampLeft] = useState<StampCoordinate>(undefined);
	const [stampUrl, setStampUrl] = useState<string>('');

	// New approach

	const [stamps, setStamps] = useState<Record<number, Stamp[]>>({});
	
	const handleSetStamps = (newStamp: Stamp) => {
		setStamps((prev) => ({
			...prev,
			[pageNum]: [...(prev[pageNum] || []), newStamp]
		}));
	}


	function setStampCoordinates(top: StampCoordinate, left: StampCoordinate): void {
		setStampTop(top);
		setStampLeft(left);
	}

	function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
		setNumPages(numPages);
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	}


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
					/>

					<main>
						<StampsBox
							setStampCoordinates={setStampCoordinates}
							setStampUrl={setStampUrl}
							handleSetStamps={handleSetStamps}
						/>

						<FileView
							file={file}
							stamps={stamps}
							onLoadSuccess={onDocumentLoadSuccess}
							pageNum={pageNum}
							stampCoordinates={{ stampTop, stampLeft }}
							stampImageUrl={stampUrl}
							setFileUrl={(data: string) => setFileUrl(data)}
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
		</>
	);
}

export default App;
