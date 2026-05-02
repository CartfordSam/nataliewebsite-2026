const photos = window.nataliePhotos || [];
const activeSlide = document.getElementById("active-slide");
const nextSlide = document.getElementById("next-slide");
const motionClasses = [
  "slide-active",
  "slide-enter-right",
  "slide-exit-left",
  "slide-enter-left",
  "slide-exit-right"
];

let shuffledPhotos = shuffle([...photos]);
let activeIndex = 0;
let isAnimating = false;

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

function nextPhoto() {
  activeIndex += 1;

  if (activeIndex >= shuffledPhotos.length) {
    shuffledPhotos = shuffle([...photos]);
    activeIndex = 0;
  }

  return shuffledPhotos[activeIndex];
}

function warmImage(path) {
  const image = new Image();
  image.src = path;
}

function setSlideImage(slide, path) {
  const backdrop = slide.querySelector(".slide-backdrop");
  const photo = slide.querySelector(".slide-photo");

  slide.classList.remove("is-portrait", "is-landscape");
  backdrop.src = path;
  photo.src = path;

  const markOrientation = () => {
    const portrait = photo.naturalHeight > photo.naturalWidth * 1.08;
    slide.classList.toggle("is-portrait", portrait);
    slide.classList.toggle("is-landscape", !portrait);
  };

  if (photo.complete && photo.naturalWidth) {
    markOrientation();
  } else {
    photo.addEventListener("load", markOrientation, { once: true });
  }
}

function resetMotion(slide, nextClass) {
  slide.classList.remove(...motionClasses);
  slide.classList.add(nextClass);
}

function transitionSlide() {
  if (isAnimating || photos.length < 2) {
    return;
  }

  isAnimating = true;
  const direction = Math.random() > 0.5 ? "right" : "left";

  setSlideImage(nextSlide, nextPhoto());
  resetMotion(nextSlide, `slide-enter-${direction}`);
  resetMotion(activeSlide, `slide-exit-${direction === "right" ? "left" : "right"}`);

  window.setTimeout(() => {
    setSlideImage(activeSlide, shuffledPhotos[activeIndex]);
    resetMotion(activeSlide, "slide-active");
    nextSlide.classList.remove(...motionClasses);
    isAnimating = false;

    warmImage(shuffledPhotos[(activeIndex + 1) % shuffledPhotos.length]);
  }, 980);
}

if (photos.length) {
  setSlideImage(activeSlide, shuffledPhotos[0]);
  resetMotion(activeSlide, "slide-active");
  warmImage(shuffledPhotos[1]);

  window.setInterval(transitionSlide, 4400);
}
