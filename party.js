const carouselPeople = window.birthdayPeople || {};
const carouselCards = document.querySelectorAll("[data-person-card]");

carouselCards.forEach((card, cardIndex) => {
  const person = carouselPeople[card.dataset.personCard];
  const image = card.querySelector("img");

  if (!person || !person.photos.length || !image) {
    return;
  }

  let activeIndex = 0;

  image.src = person.photos[activeIndex];
  image.alt = `${person.name} photo`;

  window.setInterval(() => {
    activeIndex = (activeIndex + 1) % person.photos.length;
    image.classList.add("is-swapping");

    window.setTimeout(() => {
      image.src = person.photos[activeIndex];
      image.classList.remove("is-swapping");
    }, 180);
  }, 2800 + cardIndex * 450);
});
