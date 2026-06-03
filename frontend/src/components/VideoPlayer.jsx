import { useEffect, useRef } from "react";

export default function VideoPlayer({ video, onClose }) {
  const modalRef = useRef(null);
  const isOpen = !!video;

  useEffect(() => {
    if (!modalRef.current) return;

    if (isOpen) modalRef.current.showModal();
  }, [isOpen]);

  return (
    <dialog ref={modalRef} className="modal" onClose={onClose}>
      <div className="modal-box p-0 w-11/12 aspect-video max-w-5xl">
        {isOpen ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.key}?autoplay=1`}
            title={video.name || "Video Player"}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full bg-base-100"></div>
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={() => onClose()}>close</button>
      </form>
    </dialog>
  );
}
