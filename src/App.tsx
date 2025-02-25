import { useState } from 'react';
import './App.scss';
import Header from './components/Header/Header';
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url
).toString();

function App() {
  const [numPages, setNumPages] = useState<number>();
	const [pageNumber, setPageNumber] = useState<number>(1);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
		setNumPages(numPages);
  }

  return (
		<>
			<Header />

			<main>
				{/* Stamps */}

				<div className="stamps-container">
					<h2 className="header">Stamps</h2>
				</div>

				{/* Main part  */}
				<div>
					<Document
						file="../public/sample.pdf"
						onLoadSuccess={onDocumentLoadSuccess}
					>
						<Page
							renderTextLayer={false}
							renderAnnotationLayer={false}
							pageNumber={pageNumber}
						/>
					</Document>
					<p>
						<button onClick={() => setPageNumber((prev) => prev - 1)}>
							back
						</button>
						<button onClick={() => setPageNumber((prev) => prev + 1)}>
							forward
						</button>
						Page {pageNumber} of {numPages}
					</p>
				</div>
			</main>
		</>
	);
}

export default App;
