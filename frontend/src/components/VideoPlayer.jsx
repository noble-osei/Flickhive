import { useEffect, useRef } from "react";
import IframePlaceholder from "./ui/IframePlaceholder.jsx";

export default function VideoPlayer({ video, onClose }) {
  const modalRef = useRef(null);
  const isOpen = !!video;

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen && !modal.open) modal.showModal();
    if (!isOpen && modal.open) modal.close();
  }, [isOpen]);

  return (
    <dialog ref={modalRef} className="modal" onClose={onClose}>
      <div className="modal-box p-0 w-11/12 aspect-video max-w-5xl">
        {isOpen ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0`}
            title={`Video Player: ${video.name || "Trailer"}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        ) : (
          <IframePlaceholder />
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={() => onClose()}>close</button>
      </form>
    </dialog>
  );
}
