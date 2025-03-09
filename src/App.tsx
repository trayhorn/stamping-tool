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
export type StampType = {
	id: string;
	top: number;
	left: number;
	url: string;
	width: number;
	height: number;
}

function App() {
	const [file, setFile] = useState<File | null>(null);
	const [fileUrl, setFileUrl] = useState<string>('');
  const [numPages, setNumPages] = useState<number>();
	const [pageNum, setPageNum] = useState<number>(1);
	const [stamps, setStamps] = useState<Record<number, StampType[]>>({});


	function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
		setNumPages(numPages);
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	}

	const handleSetStamps = (newStamp: StampType) => {
		setStamps((prev) => ({
			...prev,
			[pageNum]: [...(prev[pageNum] || []), newStamp],
		}));
	};

	const deleteStamp = (id: string) => {
		setStamps(prev => {
			return {
				...prev,
				[pageNum]: stamps[pageNum].filter(el => el.id !== id)
			}
		})
	}

	const updateStampPosition = (updatedStamp: StampType) => {
		const index = stamps[pageNum].findIndex(el => el.id === updatedStamp.id);

		setStamps((prev) => {
			return {
				...prev,
				[pageNum]: prev[pageNum].map((stamp, i) =>
					i === index ? updatedStamp : stamp
				),
			};
		});

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
						<StampsBox handleSetStamps={handleSetStamps} />

						<FileView
							file={file}
							stamps={stamps}
							onLoadSuccess={onDocumentLoadSuccess}
							pageNum={pageNum}
							numPages={numPages}
							setFileUrl={(data: string) => setFileUrl(data)}
							clearStamps={() => setStamps({})}
							deleteStamp={deleteStamp}
							updateStampPosition={updateStampPosition}
						/>``
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
