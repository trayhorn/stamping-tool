import { useEffect } from "react";
import { StampType } from "../App";

export default function useResize(
  data: StampType,
  ref: React.RefObject<HTMLElement | null>,
  resizeTopLeftRef: React.RefObject<HTMLElement | null>,
  resizeBottomLeftRef: React.RefObject<HTMLElement | null>,
  resizeTopRightRef: React.RefObject<HTMLElement | null>,
  resizeBottomRightRef: React.RefObject<HTMLElement | null>,
  updateStamp: (stamp: StampType) => void
) {
  const { width, height } = data;

  useEffect(() => {
    let y = 0;
    let ratio = 0;
    let elWidth = width;
    let elHeight = height;

    const resizableEl = ref.current;

    if (!resizableEl) {
      return;
    }

    const styles = window.getComputedStyle(resizableEl);

    // Resize Bottom Right

    const handleResizeDown = (e: MouseEvent) => {
      e.stopPropagation();
      ratio = width / height;

      y = e.clientY;

      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeUp);
    };

    const handleResizeMove = (e: MouseEvent) => {
      const dy = e.clientY - y;
      elHeight = elHeight + dy;
      elWidth = elWidth + ratio * dy;
      y = e.clientY;

      resizableEl.style.height = elHeight + "px";
      resizableEl.style.width = elWidth + "px";
    };

    const handleResizeUp = () => {
      updateStamp({
        ...data,
        width: elWidth,
        height: elHeight,
      });

      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeUp);
    };

    // Resize Top Right

    const handleResizeDownTopRight = (e: MouseEvent) => {
      e.stopPropagation();
      ratio = width / height;

      resizableEl.style.bottom = styles.bottom;
      resizableEl.style.top = "";

      y = e.clientY;

      document.addEventListener("mousemove", handleResizeMoveTopRight);
      document.addEventListener("mouseup", handleResizeUpTopRight);
    };

    const handleResizeMoveTopRight = (e: MouseEvent) => {
      const dy = e.clientY - y;

      elHeight = elHeight - dy;
      elWidth = elWidth - ratio * dy;
      y = e.clientY;

      resizableEl.style.height = elHeight + "px";
      resizableEl.style.width = elWidth + "px";
    };

    const handleResizeUpTopRight = () => {
      resizableEl.style.top = styles.top;
      resizableEl.style.bottom = "";

      updateStamp({
        ...data,
        top: resizableEl.getBoundingClientRect().top + window.scrollY,
        width: elWidth,
        height: elHeight,
      });

      document.removeEventListener("mousemove", handleResizeMoveTopRight);
      document.removeEventListener("mouseup", handleResizeUpTopRight);
    };

    // Resize Top Left

    const handleResizeDownTopLeft = (e: MouseEvent) => {
      e.stopPropagation();
      ratio = width / height;

      resizableEl.style.bottom = styles.bottom;
      resizableEl.style.right = styles.right;
      resizableEl.style.top = "";
      resizableEl.style.left = "";

      y = e.clientY;

      document.addEventListener("mousemove", handleResizeMoveTopLeft);
      document.addEventListener("mouseup", handleResizeUpTopLeft);
    };

    const handleResizeMoveTopLeft = (e: MouseEvent) => {
      const dy = e.clientY - y;

      elHeight = elHeight - dy;
      elWidth = elWidth - ratio * dy;
      y = e.clientY;

      resizableEl.style.height = elHeight + "px";
      resizableEl.style.width = elWidth + "px";
    };

    const handleResizeUpTopLeft = () => {
      resizableEl.style.top = styles.top;
      resizableEl.style.left = styles.left;
      resizableEl.style.bottom = "";
      resizableEl.style.right = "";

      const elRect = resizableEl.getBoundingClientRect();

      updateStamp({
        ...data,
        top: elRect.top + window.scrollY,
        left: elRect.left,
        width: elWidth,
        height: elHeight,
      });

      document.removeEventListener("mousemove", handleResizeMoveTopLeft);
      document.removeEventListener("mouseup", handleResizeUpTopLeft);
    };

    // Resize Bottom Left

    const handleResizeDownBottomLeft = (e: MouseEvent) => {
      e.stopPropagation();
      ratio = width / height;

      resizableEl.style.right = styles.right;
      resizableEl.style.left = "";

      y = e.clientY;

      document.addEventListener("mousemove", handleResizeMoveBottomLeft);
      document.addEventListener("mouseup", handleResizeUpBottomLeft);
    };

    const handleResizeMoveBottomLeft = (e: MouseEvent) => {
      const dy = e.clientY - y;

      elHeight = elHeight + dy;
      elWidth = elWidth + ratio * dy;
      y = e.clientY;

      resizableEl.style.height = elHeight + "px";
      resizableEl.style.width = elWidth + "px";
    };

    const handleResizeUpBottomLeft = () => {
      resizableEl.style.left = styles.left;
      resizableEl.style.right = "";

      const elRect = resizableEl.getBoundingClientRect();

      updateStamp({
        ...data,
        left: elRect.left,
        width: elWidth,
        height: elHeight,
      });

      document.removeEventListener("mousemove", handleResizeMoveBottomLeft);
      document.removeEventListener("mouseup", handleResizeUpBottomLeft);
    };

    const bottomRightHandle = resizeBottomRightRef.current;
    const topRightHandle = resizeTopRightRef.current;
    const topLeftHandle = resizeTopLeftRef.current;
    const bottomLeftHandle = resizeBottomLeftRef.current;

    bottomRightHandle?.addEventListener("mousedown", handleResizeDown);
    topRightHandle?.addEventListener("mousedown", handleResizeDownTopRight);
    topLeftHandle?.addEventListener("mousedown", handleResizeDownTopLeft);
    bottomLeftHandle?.addEventListener("mousedown", handleResizeDownBottomLeft);

    return () => {
      bottomRightHandle?.removeEventListener("mousedown", handleResizeDown);
      topRightHandle?.removeEventListener(
        "mousedown",
        handleResizeDownTopRight
      );
      topLeftHandle?.removeEventListener("mousedown", handleResizeDownTopLeft);
      bottomLeftHandle?.removeEventListener(
        "mousedown",
        handleResizeDownBottomLeft
      );
    };
  });
}