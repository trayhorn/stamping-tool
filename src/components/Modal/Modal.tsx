import "./Modal.scss";
import { useState, useEffect, ChangeEvent } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";


type Modal = {
  closeModal: () => void;
}

const BASE_URL = "http://localhost:3000";

export default function Modal({ closeModal }: Modal) {
	const [isDragging, setIsDragging] = useState<boolean>(false);


	const handleChange = (e: ChangeEvent) => {
		const inputEl = e.target as HTMLInputElement;
		const file = inputEl.files?.[0];

		if (!file) return;

		const formData = new FormData();
		formData.append("stamp", file);

		fetch(`${BASE_URL}/stamp/upload`, {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
			})
			.catch((e) => console.log(e));
		
		closeModal();
	}

	useEffect(() => {
		console.log("calling effect");
		const dropboxEl = document.getElementById("dropbox");

		function handleDrop(e: DragEvent) {
			e.preventDefault();
			if (e.dataTransfer?.files.length) {
				console.log(e.dataTransfer.files[0]);
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
								onChange={handleChange}
							/>
						</div>
					</form>
					<button onClick={closeModal} className="closeBtn">
						<IoCloseCircleOutline size={30} className="closeIcon" />
					</button>
				</div>
			</div>
		</>
	);
}