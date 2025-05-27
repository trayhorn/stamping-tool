import "./Modal.scss";
import { useState, ChangeEvent } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { nanoid } from "nanoid";
import Canvas from "../Canvas";
import { BASE_URL } from "../../api";
import { StampImg as StampImgType } from "../../App";



type Modal = {
	closeModal: () => void;
	addStampImage: (newStamp: StampImgType) => void;
};

export default function Modal({ addStampImage, closeModal }: Modal) {
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [upload, setUpload] = useState(true);

	const uploadImage = (file: File) => {
		const formData = new FormData();
		formData.append("stamp", file);

		fetch(`${BASE_URL}/stamp/upload`, {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then(({ originalname, url }) => {
				addStampImage({_id: nanoid(), stamp: originalname, url});
			})
			.catch((e) => console.log(e));
	}

	const handleChange = (e: ChangeEvent) => {
		const inputEl = e.target as HTMLInputElement;
		const file = inputEl.files?.[0];

		console.log(file);
		if (!file) return;

		if (file.type !== "image/png") {
			alert("Supported image type if PNG");
			return;
		}

		uploadImage(file);
		closeModal();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();

		if (!e.dataTransfer?.files.length) return;
		const file = e.dataTransfer.files[0];

		if (file.type !== "image/png") {
			alert("Please upload PNG file");
			setIsDragging(false);
			return;
		}

		uploadImage(file);
		closeModal();
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
		<>
			<div className="modal-overlay">
				<div className="modal">
					<div className="modal-controls_wrapper">
						<button className="modal-controls" onClick={() => setUpload(true)}>
							Upload
						</button>
						<button className="modal-controls" onClick={() => setUpload(false)}>
							Draw
						</button>
					</div>
					{upload ? (
						<form action="#" className="modal_file-form">
							<div
								id="dropbox"
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								style={isDragging ? { borderStyle: "dashed" } : {}}
							>
								<p>Drag and drop image here</p>
								<span>OR</span>
								<label htmlFor="id-1">attach the PNG</label>
								<input
									type="file"
									name="fileInput"
									id="id-1"
									onChange={handleChange}
								/>
							</div>
						</form>
					) : (
						<Canvas addStampImage={addStampImage} closeModal={closeModal} />
					)}
					<button onClick={closeModal} className="closeBtn">
						<IoCloseCircleOutline size={30} className="closeIcon" />
					</button>
				</div>
			</div>
		</>
	);
}