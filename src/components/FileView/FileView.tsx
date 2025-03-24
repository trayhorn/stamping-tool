import "./FileView.scss";
import { Document, Page } from "react-pdf";
import Stamp from "../Stamp/Stamp";
import { StampType } from "../../App";

type FileView = {
	pdfBlob: Blob | null;
	stamps: Record<number, StampType[]>;
	onLoadSuccess: ({ numPages }: { numPages: number }) => void;
	pageNum: number;
	deleteStamp: (id: string) => void;
	updateStamp: (updatedStamp: StampType) => void;
};

export default function FileView({
	pdfBlob,
	stamps,
	onLoadSuccess,
	pageNum,
	deleteStamp,
	updateStamp,
}: FileView) {

	return (
		<section className="document-section">
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
								onDeleteClick={deleteStamp}
								updateStamp={updateStamp}
							/>
						);
					})}
			</Document>
		</section>
	);
}