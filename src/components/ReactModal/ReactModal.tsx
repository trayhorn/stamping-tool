import Modal from "react-modal";

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
	overlay: {
		zIndex: 6,
	},
};

type ReactModalProps = {
  children: React.ReactNode;
  isModalShowing: boolean;
  closeModal: () => void;
};

Modal.setAppElement("#root");

export default function ReactModal({ children, closeModal, isModalShowing }: ReactModalProps) {

	return (
		<Modal
			isOpen={isModalShowing}
			onRequestClose={closeModal}
			style={customStyles}
			contentLabel="React Modal"
		>
			{children}
		</Modal>
	);
}
