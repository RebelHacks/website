"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import Reveal from "../reveal/Reveal";
import SectionHeading from "../section/SectionHeading";
import { photos, type Photo } from "./photoData";
import styles from "./photos.module.css";

// a shuffled copy of the list (Fisher-Yates)
function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// a square button holding one line icon (24x24 path)
interface IconButtonProps {
  label: string;
  path: string;
  onClick: () => void;
  className?: string;
}

function IconButton({ label, path, onClick, className = "" }: IconButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.iconButton} ${className}`}
      onClick={onClick}
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={path} />
      </svg>
    </button>
  );
}

// -------------- photos, as a CAPTCHA ---------------
// Clicking a tile opens it full size. Tiles you've opened get ticked, like
// selecting images in a real CAPTCHA. "More" opens the next one you haven't seen.
export default function Photos() {
  const [order, setOrder] = useState(photos);
  // srcs of the photos opened so far (they get the tick)
  const [seen, setSeen] = useState<string[]>([]);
  // position in `order` of the photo open in the viewer, or null while closed
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const showPhoto = (index: number) => {
    setViewerIndex(index);
    const { src } = order[index];
    if (!seen.includes(src)) setSeen([...seen, src]);
  };

  const handleMore = () => {
    const firstUnseen = order.findIndex((photo) => !seen.includes(photo.src));
    showPhoto(firstUnseen === -1 ? 0 : firstUnseen);
  };

  const handleShuffle = () => {
    setOrder(shuffled(photos));
    setSeen([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        <SectionHeading id="photos-heading" title="Photos">
          Moments from RebelHacks 2026. Tap a photo to see it full size, or hit
          More to flip through them.
        </SectionHeading>
      </div>

      <div className={styles.captcha}>
        <header className={styles.banner}>
          <p className={styles.prompt}>
            <span className={styles.promptLead}>Select all images from</span>
            <span className={styles.promptSubject}>RebelHacks 2026</span>
          </p>
          <p className={styles.promptHint}>
            Click More once you&apos;re intrigued.
          </p>
        </header>

        {/* the tiles deal in when the box scrolls into view, and again after
            each shuffle (a new order is a new key, so the list is re-created) */}
        <Reveal>
          <ul
            key={order.map((photo) => photo.src).join()}
            className={styles.grid}
          >
            {order.map((photo, index) => (
              <li key={photo.src} style={{ "--i": index } as CSSProperties}>
                <button
                  type="button"
                  className={styles.tile}
                  data-seen={seen.includes(photo.src) || undefined}
                  onClick={() => showPhoto(index)}
                  aria-label={`Open photo: ${photo.caption || photo.alt}`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 320px"
                    className={styles.photo}
                    style={{ objectPosition: photo.cropPosition }}
                  />
                  <span className={styles.tick} aria-hidden="true">
                    <svg viewBox="0 0 16 16">
                      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                    </svg>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>

        <footer className={styles.toolbar}>
          <IconButton
            label="Shuffle photos"
            path="M20 12a8 8 0 1 1-2.34-5.66M20 4v4.5h-4.5"
            onClick={handleShuffle}
          />
          <button
            type="button"
            className={`button ${styles.more}`}
            onClick={handleMore}
          >
            More
          </button>
        </footer>
      </div>

      {viewerIndex !== null && (
        <PhotoViewer
          photos={order}
          index={viewerIndex}
          onShow={showPhoto}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </div>
  );
}

// --------------------- photo viewer ---------------------
interface PhotoViewerProps {
  photos: Photo[];
  // which photo is showing; the parent owns this so it can tick seen photos
  index: number;
  onShow: (index: number) => void;
  onClose: () => void;
}

// Mounted only while open.
function PhotoViewer({ photos, index, onShow, onClose }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const photo = photos[index];
  // closing fires the dialog's close event, which calls onClose
  const close = () => dialogRef.current?.close();

  // open as a modal once mounted; let the browser handle Esc and focus!
  // (no close() in the cleanup: the dialog leaves the page when this unmounts,
  // and closing it there would fire onClose during React's dev double-run)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) return;

    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const showPrevious = () =>
    onShow((index - 1 + photos.length) % photos.length);
  const showNext = () => onShow((index + 1) % photos.length);

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowLeft") showPrevious();
    if (event.key === "ArrowRight") showNext();
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.viewer}
      aria-labelledby="photo-viewer-caption"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      onClose={onClose}
    >
      <header className={styles.viewerBanner}>
        <p id="photo-viewer-caption" className={styles.viewerCaption}>
          {photo.caption || photo.alt}
        </p>
        <IconButton
          label="Close photo"
          path="M7 7l10 10M17 7 7 17"
          onClick={close}
          className={styles.onRed}
        />
      </header>

      <figure className={styles.viewerFigure}>
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(max-width: 768px) 92vw, 1000px"
          className={styles.viewerPhoto}
        />
      </figure>

      <footer className={styles.toolbar}>
        <div className={styles.viewerNav}>
          <IconButton
            label="Previous photo"
            path="M15 5l-7 7 7 7"
            onClick={showPrevious}
          />
          <IconButton
            label="Next photo"
            path="M9 5l7 7-7 7"
            onClick={showNext}
          />
          <span className={styles.viewerCount}>
            {index + 1} / {photos.length}
          </span>
        </div>
        <button
          type="button"
          className={`button ${styles.more}`}
          onClick={close}
        >
          Done
        </button>
      </footer>
    </dialog>
  );
}
