const galleryPhotos = window.nataliePhotos || [];
const galleryGrid = document.getElementById("gallery-grid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCount = document.getElementById("lightbox-count");
const closeButton = document.getElementById("lightbox-close");
const previousButton = document.getElementById("lightbox-prev");
const nextButton = document.getElementById("lightbox-next");

let activePhotoIndex = 0;

function photoLabel(index) {
  return `Natalie photo ${index + 1}`;
}

function renderGallery() {
  const fragment = document.createDocumentFragment();

  galleryPhotos.forEach((photo, index) => {
    const button = document.createElement("button");
    button.className = "gallery-item";
    button.type = "button";
    button.setAttribute("aria-label", `Open ${photoLabel(index)}`);
    button.addEventListener("click", () => openLightbox(index));

    const image = document.createElement("img");
    image.src = photo;
    image.alt = photoLabel(index);
    image.loading = "lazy";

    button.append(image);
    fragment.append(button);
  });

  galleryGrid.append(fragment);
}

function openLightbox(index) {
  activePhotoIndex = index;
  updateLightbox();
  lightbox.hidden = false;
  document.body.classList.add("is-viewing-photo");
  closeButton.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("is-viewing-photo");
}

function updateLightbox() {
  lightboxImage.src = galleryPhotos[activePhotoIndex];
  lightboxImage.alt = photoLabel(activePhotoIndex);
  lightboxCount.textContent = `${activePhotoIndex + 1} / ${galleryPhotos.length}`;
}

function showAdjacentPhoto(step) {
  activePhotoIndex = (activePhotoIndex + step + galleryPhotos.length) % galleryPhotos.length;
  updateLightbox();
}

closeButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", () => showAdjacentPhoto(-1));
nextButton.addEventListener("click", () => showAdjacentPhoto(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showAdjacentPhoto(-1);
  }

  if (event.key === "ArrowRight") {
    showAdjacentPhoto(1);
  }
});

renderGallery();
