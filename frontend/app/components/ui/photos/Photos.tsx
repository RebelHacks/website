"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { photos, type Photo } from "./photoData";
import styles from "./photos.module.css";

// -------------- photos ---------------
export default function Photos() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleOpenPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className={styles.photosContainer}>
      <header className={styles.photosHeader}>
        <h2 id="photos-heading" className={styles.photosTitle}>
          RebelHacks in photos
        </h2>
        <p className={styles.photosSubtitle}>
          A look back at the people and moments of RebelHacks 2026!
        </p>
      </header>
      <div className={styles.photosGrid}>
        {photos.map((photo) => {
          //handle thumbnail appearance... caption fallback/crop/click behavior
          const { src, alt, caption, cropPosition } = photo;

          return (
            <figure key={src} className={styles.photoCard}>
              <button
                type="button"
                className={styles.photoFrame}
                aria-label={`Enlarge photo: ${caption || alt}`}
                aria-haspopup="dialog"
                onClick={() => handleOpenPhoto(photo)}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px" // grid: 1 col <= 768px, 2 cols <= 1024px, 3 cols in a 1200px container.
                  className={styles.photo}
                  style={{ objectPosition: cropPosition }}
                />
                <span className={styles.enlargeHint} aria-hidden="true">
                  Open
                </span>
              </button>
              {caption && (
                <figcaption className={styles.photoCaption}>
                  {caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      <PhotoViewer photo={selectedPhoto} onClose={handleClosePhoto} />
    </div>
  );
}

// --------------------- photo viewer ---------------------
interface PhotoViewerProps {
  photo: Photo | null;
  onClose: () => void;
}

function PhotoViewer({ photo, onClose }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // open after React renders the selected Image into dialog; let the browser handle the keypressing!
  useEffect(() => {
    const dialog = dialogRef.current;

    if (photo === null || dialog === null) {
      return;
    }

    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.close();
    };
  }, [photo]);

  const handleCloseDialog = () => {
    if (dialogRef.current !== null) {
      dialogRef.current.close();
    }
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      handleCloseDialog();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.photoViewer}
      aria-labelledby="photo-viewer-caption"
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      <button
        type="button"
        className={styles.closeButton}
        onClick={handleCloseDialog}
        aria-label="Close photo"
      >
        <span aria-hidden="true">X</span>
      </button>

      {photo && (
        <figure>
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 768px) 92vw, 1100px"
            className={styles.enlargedPhoto}
          />
          <figcaption
            id="photo-viewer-caption"
            className={styles.viewerCaption}
          >
            {photo.caption || photo.alt}
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}
