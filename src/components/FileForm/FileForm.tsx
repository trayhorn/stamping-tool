import "./FileForm.scss";
import { ChangeEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

type FileForm = {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (file: File) => void;
};

export default function FileForm({ onChange, onDrop }: FileForm) {
	const [isDragging, setIsDragging] = useState<boolean>(false);

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();

		if (!e.dataTransfer?.files.length) return;
		const file = e.dataTransfer.files[0];

		if (file.type !== "application/pdf") {
			toast.error("Please upload PDF file");
			setIsDragging(false);
		} else {
			onDrop(e.dataTransfer.files[0]);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	return (
		<form className="file-form">
			<div
				id="dropbox"
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				style={isDragging ? { borderStyle: "dashed" } : {}}
			>
				<p>Drag and drop the file here</p>
				<span>OR</span>
				<label htmlFor="id-1">attach the PDF</label>
				<input type="file" name="fileInput" id="id-1" onChange={onChange} />
			</div>
			<ToastContainer />
		</form>
	);
}