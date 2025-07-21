import { useState, ChangeEvent } from "react";
import { BASE_URL } from "../../api";
import { StampImg as StampImgType } from "../../App";

type UploadStampFormProps = {
  closeModal: () => void;
  addStampImage: (newStamp: StampImgType) => void;
}

export default function UploadStampForm({ closeModal, addStampImage }: UploadStampFormProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const uploadImage = (file: File) => {
      const formData = new FormData();
      formData.append("stamp", file);
  
      fetch(`${BASE_URL}/stamp/upload`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then(({ originalname, url, _id }) => {
          addStampImage({ _id, stamp: originalname, url });
        })
        .catch((e) => console.log(e));
    };
  
    const handleChange = (e: ChangeEvent) => {
      const inputEl = e.target as HTMLInputElement;
      const file = inputEl.files?.[0];
  
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
				<input type="file" name="fileInput" id="id-1" onChange={handleChange} />
			</div>
		</form>
	);
}