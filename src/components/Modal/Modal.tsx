import "./Modal.scss";
import { useState, useEffect } from "react";

type Modal = {
  closeModal: () => void;
}


export default function Modal({ closeModal }: Modal) {
	const [isDragging, setIsDragging] = useState<boolean>(false);

	useEffect(() => {
		console.log("calling effect");
		const dropboxEl = document.getElementById("dropbox");

		function handleDrop(e: DragEvent) {
			e.preventDefault();
			if (e.dataTransfer?.files.length) {
				console.log(e.dataTransfer);
				// onDrop(e.dataTransfer.files[0]);
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
		dropboxEl?.addEventListener("dragleave", handleDragLeave);
		dropboxEl?.addEventListener("drop", handleDrop);

		return () => {
			dropboxEl?.removeEventListener("dragover", handleDragOver);
			dropboxEl?.removeEventListener("dragleave", handleDragLeave);
			dropboxEl?.removeEventListener("drop", handleDrop);
		};
	}, []);

	return (
		<>
			<div className="modal-overlay">
				<div className="modal">
					<form action="#" className="modal_file-form">
						<div
							id="dropbox"
							style={isDragging ? { borderStyle: "dashed" } : {}}
						>
							<p>Drag and drop the file here</p>
							<span>OR</span>
							<label htmlFor="id-1">attach the PDF</label>
							<input
								type="file"
								name="fileInput"
								id="id-1"
								onChange={(e) => console.dir(e.target)}
							/>
						</div>
					</form>
					<button onClick={closeModal}>Close</button>
				</div>
			</div>
		</>
	);
}