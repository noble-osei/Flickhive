import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import IframePlaceholder from "../ui/IframePlaceholder.jsx";

export default function VideoPlayer({ video, onClose }) {
  const modalRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [playerError, setPlayerError] = useState(false);

  const isOpen = Boolean(video);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen && !modal.open) {
      setLoading(true);
      setPlayerError(false);
      modal.showModal();
    }

    if (!isOpen && modal.open) {
      modal.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!video) return;

    (() => {
      setLoading(true);
      setPlayerError(false);
    })();
  }, [video]);

  function handleClose() {
    setLoading(false);
    setPlayerError(false);
    onClose();
  }

  return (
    <dialog
      ref={modalRef}
      className="modal"
      onClose={handleClose}
      aria-label="Video player"
    >
      <div className="modal-box relative p-0 w-11/12 aspect-video max-w-5xl overflow-hidden bg-base-200">
        {isOpen && (
          <ReactPlayer
            key={video.key}
            src={`https://www.youtube.com/watch?v=${video.key}`}
            controls
            playing={isOpen}
            playsInline
            width="100%"
            height="100%"
            config={{
              youtube: {
                rel: 0,
                autoplay: 1,
                playsinline: 1,
              },
            }}
            onReady={() => setLoading(false)}
            onPlaying={() => setLoading(false)}
            onWaiting={() => setLoading(true)}
            onError={() => {
              setLoading(false);
              setPlayerError(true);
            }}
          />
        )}

        {isOpen && loading && (
          <div className="absolute inset-0 z-10">
            <IframePlaceholder />
          </div>
        )}

        {playerError && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-base-200 px-4 text-center">
            <div>
              <h2 className="text-lg font-bold">Couldn't load this video</h2>

              <p className="mt-2 text-sm text-base-content/60">
                The trailer may be unavailable or blocked from playing here.
              </p>

              <button
                type="button"
                className="btn btn-primary rounded-full mt-4"
                onClick={handleClose}
              >
                Close player
              </button>
            </div>
          </div>
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="submit" aria-label="Close video player">
          close
        </button>
      </form>
    </dialog>
  );
}
