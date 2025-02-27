import "./FileForm.scss";
import { ChangeEvent, useState, useEffect } from "react";

type FileForm = {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (file: File) => void;
};

export default function FileForm({ onChange, onDrop }: FileForm) {
  const [isDragging, setIsDragging] = useState<boolean>(false);

	useEffect(() => {
		const dropboxEl = document.getElementById("dropbox");

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

    dropboxEl?.addEventListener("dragover", handleDragOver);
    dropboxEl?.addEventListener('dragleave', handleDragLeave);
		dropboxEl?.addEventListener("drop", handleDrop);

    return () => {
      dropboxEl?.removeEventListener("dragover", handleDragOver);
      dropboxEl?.removeEventListener("dragleave", handleDragLeave);
			dropboxEl?.removeEventListener("drop", handleDrop);
		};
	}, [onDrop]);

	return (
		<form action="#" className="file-form">
			<div id="dropbox" style={isDragging ? {borderStyle: 'dashed'} : {}}>
        <p>Drag and drop the file here</p>
        <span>OR</span>
        <label htmlFor="id-1">attach the PDF</label>
        <input type="file" name="fileInput" id="id-1" onChange={onChange} />
			</div>
		</form>
	);
}