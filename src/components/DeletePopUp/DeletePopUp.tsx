import "./DeletePopUp.scss";
import { useTranslation } from "react-i18next";

type PopUpProps = {
	closeModal: () => void;
	handleStampDelete: (id: string) => void;
	id: string;
};

export default function DeletePopUp({ closeModal, handleStampDelete, id }: PopUpProps) {
	const { t } = useTranslation();

	return (
		<div className="delete-popup">
			<h2 className="title">{t("deleteConfirmation")}</h2>
			<div className="buttons-container">
				<button className="button delete" onClick={() => handleStampDelete(id)}>{t("delete")}</button>
				<button className="button cancel" onClick={closeModal}>{t("cancel")}</button>
			</div>
		</div>
	);
}
