import "./DeletePopUp.scss";

type PopUpProps = {
	closeModal: () => void;
	handleStampDelete: (id: string) => void;
	id: string;
};

export default function DeletePopUp({ closeModal, handleStampDelete, id }: PopUpProps) {

	return (
		<div className="delete-popup">
			<h2 className="title">Are you sure you want to delete this stamp?</h2>
			<div className="buttons-container">
				<button className="button delete" onClick={() => handleStampDelete(id)}>Delete</button>
				<button className="button cancel" onClick={closeModal}>Cancel</button>
			</div>
		</div>
	);
}
