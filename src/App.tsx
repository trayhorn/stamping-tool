import { ChangeEvent, useEffect, useState } from 'react';
import './App.scss';
import Header from './components/Header/Header';
import { Document, Page, pdfjs, Thumbnail } from "react-pdf";

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

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	}

	useEffect(() => {
		const dropboxEl = document.getElementById("dropbox");

		function handleDrop(event: DragEvent) {
			event.preventDefault();
			event.stopPropagation();
			setFile(event.dataTransfer.files[0]);
		}

		function handleDragOver(event: DragEvent) {
			event.preventDefault();
		}

		dropboxEl?.addEventListener("dragover", handleDragOver);
		dropboxEl?.addEventListener("drop", handleDrop);

		return () => {
			dropboxEl?.removeEventListener("dragover", handleDragOver);
			dropboxEl?.removeEventListener("drop", handleDrop);
		}
	}, [])

  return (
		<>
			{!file && (
				<form action="#">
					<div id="dropbox">
						<p>Place your file here</p>
					</div>
					<label htmlFor="id-1">Please attach the PDF</label>
					<input
						type="file"
						name="fileInput"
						id="id-1"
						onChange={handleChange}
					/>
				</form>
			)}

			{file && (
				<>
					<Header filename={file.name} />

					<main>
						<div className="sidebar">
							<h2 className="heading">Stamps</h2>
						</div>

						<section className="document-section">
							<Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
								<Page
									className="page"
									height={942}
									renderTextLayer={false}
									renderAnnotationLayer={false}
									pageNumber={pageNum}
								/>
							</Document>
						</section>

						<div className="sidebar sidebar-preview">
							<h2 className="heading">Preview</h2>
							<Document
								className="thumbnail-document"
								file={file}
								onLoadSuccess={onDocumentLoadSuccess}
							>
								{[...Array(numPages)].map((_, i) => {
									return (
										<Thumbnail
											key={i}
											width={205}
											className="thumbnail"
											pageNumber={i + 1}
											onItemClick={({ pageNumber }) => setPageNum(pageNumber)}
										/>
									);
								})}
							</Document>
						</div>
					</main>
				</>
			)}
		</>
	);
}

export default App;
