"use client";

import Image from "next/image";
import { flushSync } from "react-dom";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { prefersLessMotion } from "@/lib/motion";
import Reveal from "../reveal/Reveal";
import Section from "../section/Section";
import { photos, type Photo } from "./photoData";
import styles from "./photos.module.css";

// -------------- photos, as a CAPTCHA ---------------
export default function Photos() {
  const [order, setOrder] = useState(photos);
  // index in `order` of the open photo, or null when the viewer is closed
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const handleShuffle = () => setOrder(shuffled(photos));

  // "Open window" animation from Lauren's notes: the viewer grows from the
  // clicked tile. A view transition animates between two elements with the same
  // view-transition-name, so the tile has the name until the viewer takes it.
  const openViewer = (index: number, tile?: HTMLElement) => {
    if (!document.startViewTransition || prefersLessMotion()) {
      setViewerIndex(index);
      return;
    }
    if (tile) tile.style.viewTransitionName = "photo-window";
    document.startViewTransition(() => {
      // only one element can have the name at a time
      if (tile) tile.style.viewTransitionName = "";
      // flushSync renders now, so the transition sees where the viewer ends up
      flushSync(() => setViewerIndex(index));
    });
  };

  return (
    <Section
      id="photos"
      title="Photos"
      lead={
        <>
          Moments from RebelHacks 2026. Tap a photo to see it full size, or hit
          More to flip through them.
        </>
      }
      stickyHeading
    >
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

        {/* new key on shuffle so the entrance animation runs again */}
        <Reveal>
          <ul
            key={order.map((photo) => photo.src).join()}
            className={styles.grid}
          >
            {order.map((photo, index) => (
              <li key={photo.src} style={{ "--index": index } as CSSProperties}>
                <button
                  type="button"
                  className={styles.tile}
                  onClick={(event) => openViewer(index, event.currentTarget)}
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
                </button>
              </li>
            ))}
          </ul>
        </Reveal>

        <footer className={styles.toolbar}>
          <IconButton
            label="Shuffle photos"
            iconPath="M20 12a8 8 0 1 1-2.34-5.66M20 4v4.5h-4.5"
            onClick={handleShuffle}
            className={styles.shuffle}
          />
          <button
            type="button"
            className={`button ${styles.more}`}
            onClick={() => openViewer(0)}
          >
            More
          </button>
        </footer>
      </div>

      {viewerIndex !== null && (
        <PhotoViewer
          photos={order}
          index={viewerIndex}
          onShow={setViewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </Section>
  );
}

// --------------------- photo viewer ---------------------
interface PhotoViewerProps {
  photos: Photo[];
  // in the parent so the grid can open any photo
  index: number;
  onShow: (index: number) => void;
  onClose: () => void;
}

// Mounted only while a photo is open.
function PhotoViewer({ photos, index, onShow, onClose }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const photo = photos[index];
  // dialog.close() triggers onClose through the close event
  const close = () => dialogRef.current!.close();

  // showModal() handles Esc and keeps focus inside.
  // Don't close() in a cleanup: React's dev-mode double run would call onClose.
  // The `open` check is for that double run too.
  useEffect(() => {
    const dialog = dialogRef.current!;
    if (!dialog.open) dialog.showModal();
  }, []);

  const showPrevious = () =>
    onShow((index - 1 + photos.length) % photos.length);
  const showNext = () => onShow((index + 1) % photos.length);

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowLeft") showPrevious();
    if (event.key === "ArrowRight") showNext();
  };

  // The window fills the <dialog>, so a dialog click is a backdrop click.
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
      <div className={styles.viewerWindow}>
        <header className={styles.viewerBanner}>
          <p id="photo-viewer-caption" className={styles.viewerCaption}>
            {photo.caption || photo.alt}
          </p>
          <IconButton
            label="Close photo"
            iconPath="M7 7l10 10M17 7 7 17"
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
              iconPath="M15 5l-7 7 7 7"
              onClick={showPrevious}
            />
            <IconButton
              label="Next photo"
              iconPath="M9 5l7 7-7 7"
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
      </div>
    </dialog>
  );
}

// --------------------- shared ---------------------
interface IconButtonProps {
  label: string;
  // SVG path in a 24x24 viewBox
  iconPath: string;
  onClick: () => void;
  className?: string;
}

function IconButton({
  label,
  iconPath,
  onClick,
  className = "",
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.iconButton} ${className}`}
      onClick={onClick}
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={iconPath} />
      </svg>
    </button>
  );
}

// Fisher-Yates shuffle, on a copy
function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
