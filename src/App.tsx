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

function App() {
	const [file, setFile] = useState<File | null>(null);
	
  const [numPages, setNumPages] = useState<number>();
	const [pageNum, setPageNum] = useState<number>(1);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
		setNumPages(numPages);
	}

	function onItemClick(num: number): void {
		setPageNum(num);
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
					<Header file={file} clearFile={() => setFile(null)} />

					<main>
						<StampsBox />

						<FileView
							file={file}
							onLoadSuccess={onDocumentLoadSuccess}
							pageNum={pageNum}
						/>
						<FilePreview
							file={file}
							onLoadSuccess={onDocumentLoadSuccess}
							numPages={numPages}
							onItemClick={onItemClick}
						/>
					</main>
				</>
			)}
		</>
	);
}

export default App;
