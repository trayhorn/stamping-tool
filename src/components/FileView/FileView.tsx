import "./FileView.scss";
import { Document, Page } from "react-pdf";
import Stamp from "../Stamp/Stamp";
import { StampType } from "../../App";
import { useRef } from "react";

type FileView = {
	pdfBlob: Blob | null;
	stamps: Record<number, StampType[]>;
	onLoadSuccess: ({ numPages }: { numPages: number }) => void;
	pageNum: number;
	deleteStamp: (id: string) => void;
	updateStamp: (updatedStamp: StampType) => void;
	scrollRef: React.RefObject<number>
};

export default function FileView({
	pdfBlob,
	stamps,
	onLoadSuccess,
	pageNum,
	deleteStamp,
	updateStamp,
	scrollRef,
}: FileView) {
	const docSectionRef = useRef<HTMLElement | null>(null);

	const handleScroll = (e: React.UIEvent<HTMLElement>) => {
		const el = e.target as HTMLElement;
		scrollRef.current = el.scrollTop;
		// console.log(scrollRef.current);
	};

	return (
		<section
			ref={docSectionRef}
			className="document-section"
			onScroll={handleScroll}
		>
			<Document file={pdfBlob} onLoadSuccess={onLoadSuccess}>
				<Page
					className="page"
					height={1042}
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
								docSectionRef={docSectionRef}
								scrollRef={scrollRef}
							/>
						);
					})}
			</Document>
		</section>
	);
}