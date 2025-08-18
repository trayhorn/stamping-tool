import { useEffect, useRef, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { getStampsImages, deleteStampImage } from "../../api";
import { StampType, StampImg as StampImgType } from "../../App";
import StampImg from "./StampImg";
import Loader from "../utils/Loader/Loader";
import ReactModal from "../ReactModal/ReactModal";
import UploadStampManager from "../UploadStampManager/UploadStampManager";
import { FiPlus } from "react-icons/fi";
import "./StampsBox.scss";


type StampsBox = {
	stampsImgs: StampImgType[];
	updateStampsImgs: (result: StampImgType[]) => void;
	handleSetStamps: (newStamp: StampType) => void;
	scrollRef: React.RefObject<number>;
	addStampImage: (newStamp: StampImgType) => void;
};

export default function StampsBox({
	stampsImgs,
	updateStampsImgs,
	handleSetStamps,
	addStampImage,
	scrollRef,
}: StampsBox) {
	const { t } = useTranslation();

	const [isLoading, setIsLoading] = useState(false);
	const { isModalShowing, openModal, closeModal } = useModal();

	const containerRef = useRef<HTMLDivElement | null>(null);
	const cloneRef = useRef<HTMLElement | null>(null);

	const startXRef = useRef(0);
	const startYRef = useRef(0);
	const newXRef = useRef(0);
	const newYRef = useRef(0);

	const handleMouseDown = (e: React.MouseEvent) => {
		const el = e.target as HTMLElement;
		if (!el?.classList.contains("stamp")) {
			return;
		}

		startXRef.current = e.clientX;
		startYRef.current = e.clientY;

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		cloneRef.current = el.cloneNode(true) as HTMLElement;
		cloneRef.current.classList.add("clone");

		if (el.parentElement) {
			cloneRef.current.style.top = `${el.parentElement.offsetTop}px`;
			cloneRef.current.style.left = `${el.parentElement.offsetLeft}px`;
		}

		containerRef.current?.appendChild(cloneRef.current);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!cloneRef.current) return;

		newXRef.current = startXRef.current - e.clientX;
		newYRef.current = startYRef.current - e.clientY;

		startXRef.current = e.clientX;
		startYRef.current = e.clientY;

		cloneRef.current.style.top = `${
			cloneRef.current.offsetTop - newYRef.current
		}px`;
		cloneRef.current.style.left = `${
			cloneRef.current.offsetLeft - newXRef.current
		}px`;
	};

	const handleMouseUp = (e: MouseEvent) => {
		const documentPage = document.querySelector(".document-section");
		const canvasEl = document.querySelector(
			".react-pdf__Page__canvas"
		) as HTMLCanvasElement | null;
		const clone = e.target as HTMLElement | null;

		if (!canvasEl || !clone || !documentPage) return;

		const docRect = documentPage?.getBoundingClientRect();
		const pageRect = canvasEl.getBoundingClientRect();
		const cloneRect = clone.getBoundingClientRect();

		function checkTargetInsideDropBox(
			dropboxRect: DOMRect,
			targetRect: DOMRect
		) {
			if (
				targetRect.top > dropboxRect.top &&
				targetRect.bottom < dropboxRect.bottom &&
				targetRect.left > dropboxRect.left - targetRect.width * 0.9 &&
				targetRect.left < dropboxRect.right
			) {
				return true;
			} else {
				return false;
			}
		}

		if (checkTargetInsideDropBox(pageRect, cloneRect)) {
			const newStamp = {
				id: crypto.randomUUID(),
				top: cloneRect.top - docRect.top + scrollRef.current,
				left: cloneRect.left - docRect.left,
				url: clone.getAttribute("src") || "",
				width: cloneRect.width,
				height: cloneRect.height,
				rotate: 0,
			};

			handleSetStamps(newStamp);
		}

		clone.remove();

		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	};

	useEffect(() => {
		async function handleGetAllStampsImages() {
			try {
				setIsLoading(true);
				const { data } = await getStampsImages();
				updateStampsImgs(data);
			} catch (error: unknown) {
				if (axios.isAxiosError(error)) {
					console.log(error.message);
				} else {
					console.log("Unexpected error", error);
				}
			} finally {
				setIsLoading(false);
			}
		}

		handleGetAllStampsImages();
	}, [updateStampsImgs])

	const handleStampDelete = async (id: string) => {
		try {
			await deleteStampImage(id);
			updateStampsImgs(stampsImgs.filter((stamp) => stamp._id !== id));
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.message);
			} else {
				console.log("Unexpected error", error);
			}
		}
	};

	return (
		<>
			<div
				className="sidebar"
				style={{ position: isLoading ? "relative" : "static" }}
			>
				<h2 className="heading">{t("Stamps")}</h2>
				{isLoading ? (
					<>
						<Loader />
						<div style={{ padding: "16px" }}>
							{t("Fetching")}
						</div>
					</>
				) : (
					<div
						className="stamps-list"
						ref={containerRef}
						onMouseDown={handleMouseDown}
					>
						{stampsImgs.map(({ _id, stamp, url }) => {
							return (
								<StampImg
									key={_id}
									imageURL={url}
									name={stamp}
									id={_id}
									handleStampDelete={handleStampDelete}
								/>
							);
						})}
						<div className="stamp-item add-stamp_container" onClick={openModal}>
							<FiPlus className="add-stamp_icon" size="2rem" />
						</div>
					</div>
				)}
			</div>
			<ReactModal isModalShowing={isModalShowing} closeModal={closeModal}>
				<UploadStampManager
					closeModal={closeModal}
					addStampImage={addStampImage}
				/>
			</ReactModal>
		</>
	);
}