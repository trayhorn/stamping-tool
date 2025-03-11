import "./FileForm.scss";
import { ChangeEvent, useState, useEffect, useRef } from "react";

type FileForm = {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (file: File) => void;
};

export default function FileForm({ onChange, onDrop }: FileForm) {
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const dropboxRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const dropbox = dropboxRef.current;

		function handleDrop(e: DragEvent) {
			e.preventDefault();
			if (e.dataTransfer?.files.length) {
				onDrop(e.dataTransfer.files[0]);
			}
		}

		function handleDragOver(e: DragEvent) {
      e.preventDefault();
      setIsDragging(true);
    }
    
    function handleDragLeave(e: DragEvent) {
      e.preventDefault();
      setIsDragging(false);
		}

    dropbox?.addEventListener("dragover", handleDragOver);
    dropbox?.addEventListener('dragleave', handleDragLeave);
		dropbox?.addEventListener("drop", handleDrop);

		return () => {
      dropbox?.removeEventListener("dragover", handleDragOver);
      dropbox?.removeEventListener("dragleave", handleDragLeave);
			dropbox?.removeEventListener("drop", handleDrop);
		};
	}, [onDrop]);

	return (
		<form className="file-form">
			<div
				id="dropbox"
				ref={dropboxRef}
				style={isDragging ? { borderStyle: "dashed" } : {}}
			>
				<p>Drag and drop the file here</p>
				<span>OR</span>
				<label htmlFor="id-1">attach the PDF</label>
				<input type="file" name="fileInput" id="id-1" onChange={onChange} />
			</div>
		</form>
	);
}