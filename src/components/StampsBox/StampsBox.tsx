import { useEffect } from "react";
import "./StampsBox.scss";

export default function StampsBox() {

  useEffect(() => {
    const container = document.querySelector(".stamps-list");

		let startX = 0;
		let startY = 0;
		let newX = 0;
		let newY = 0;

		let clone;

    const handleMouseDown = (e) => {
      console.log('mouseDown')
      if (!e.target.classList.contains("stamp")) {
				return;
      }

      console.log(e.target.offsetTop);
			startX = e.clientX;
			startY = e.clientY;

			document.addEventListener("mousemove", handleMouseMove);

			clone = e.target.cloneNode(true);
			clone.classList.add("clone");
			clone.style.top = e.target.parentNode.offsetTop + "px";
			clone.style.left = e.target.parentNode.offsetLeft + "px";

			container.appendChild(clone);
		};

    const handleMouseMove = (e) => {
      console.log("mouseMove");

			newX = startX - e.clientX;
			newY = startY - e.clientY;

			startX = e.clientX;
			startY = e.clientY;

			clone.style.top = clone.offsetTop - newY + "px";
			clone.style.left = clone.offsetLeft - newX + "px";
		};

    const handleMouseUp = () => {
      console.log("mouseUp");

			document.removeEventListener("mousemove", handleMouseMove);
		};

		document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("mouseup", handleMouseUp);
    }
  }, [])


  return (
		<div className="sidebar">
			<h2 className="heading">Stamps</h2>
			<div className="stamps-list">
				<div className="stamp-item">
          <img
            draggable="false"
            className="stamp"
            src="/public/images/AttachmentDateStamp-55mmx55mm-300dpi.png"
            alt="stamp_1"
          />
				</div>
				<div className="stamp-item">
          <img
            draggable="false"
            className="stamp"
            src="/public/images/ChamberStamp-55mmx55mm-300dpi.png"
            alt="stamp_2"
          />
				</div>
				<div className="stamp-item">
          <img
            draggable="false"
            className="stamp"
            src="/public/images/Notary_55x55canvas300dpi.png"
            alt="stamp_3"
          />
				</div>
			</div>
		</div>
	);
}