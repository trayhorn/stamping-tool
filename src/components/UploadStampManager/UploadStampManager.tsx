import "./UploadStampManager.scss";
import { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import Canvas from "../Canvas/Canvas";
import UploadStampForm from "../UploadStampForm/UploadStampForm";
import { StampImg as StampImgType } from "../../App";
import { useTranslation } from "react-i18next";

type UploadStampManagerProps = {
	closeModal: () => void;
	addStampImage: (newStamp: StampImgType) => void;
};

export default function UploadStampManager({
	addStampImage,
	closeModal,
}: UploadStampManagerProps) {
	const { t } = useTranslation();
	const [upload, setUpload] = useState(true);

	return (
		<div>
			<div className="modal-controls_wrapper">
				<button className="modal-controls" onClick={() => setUpload(true)}>
					{t("Upload")}
				</button>
				<button className="modal-controls" onClick={() => setUpload(false)}>
					{t("Draw")}
				</button>
			</div>
			{upload ? (
				<UploadStampForm
					addStampImage={addStampImage}
					closeModal={closeModal}
				/>
			) : (
				<Canvas addStampImage={addStampImage} closeModal={closeModal} />
			)}
			<button onClick={closeModal} className="closeBtn">
				<IoCloseCircleOutline size={30} className="closeIcon" />
			</button>
		</div>
	);
}