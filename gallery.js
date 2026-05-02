const people = window.birthdayPeople || {
  natalie: {
    name: "Natalie",
    photos: window.nataliePhotos || []
  }
};
const requestedPerson = new URLSearchParams(window.location.search).get("person") || "natalie";
const activePerson = people[requestedPerson] || people.natalie;
const galleryPhotos = activePerson.photos || [];
const galleryGrid = document.getElementById("gallery-grid");
const galleryTitle = document.getElementById("gallery-title");
const galleryCopy = document.getElementById("gallery-copy");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCount = document.getElementById("lightbox-count");
const closeButton = document.getElementById("lightbox-close");
const previousButton = document.getElementById("lightbox-prev");
const nextButton = document.getElementById("lightbox-next");

let activePhotoIndex = 0;

function photoLabel(index) {
  return `${activePerson.name} photo ${index + 1}`;
}

function updateGalleryIntro() {
  document.title = `${activePerson.name}'s Birthday Gallery`;
  galleryTitle.textContent = `${activePerson.name}'s Photo Gallery`;
  galleryCopy.textContent = `Every favorite picture of ${activePerson.name} in one place, with a full-screen view for slowing down on the best ones.`;
  galleryGrid.setAttribute("aria-label", `${activePerson.name} photo gallery`);
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

updateGalleryIntro();
renderGallery();
