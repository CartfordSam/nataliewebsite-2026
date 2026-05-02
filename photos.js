const nataliePhotos = [
  "images/IMG_2264.jpeg",
  "images/DSC_9556.jpeg",
  "images/IMG_5276.jpeg",
  "images/IMG_1540.jpeg",
  "images/IMG_8223.jpeg",
  "images/IMG_1757.jpeg",
  "images/IMG_0015.jpeg",
  "images/IMG_0444.jpeg",
  "images/IMG_1351.jpeg",
  "images/IMG_3049.jpeg",
  "images/IMG_1721.jpeg",
  "images/IMG_3136.jpeg",
  "images/IMG_1679.jpeg",
  "images/IMG_2311.jpeg",
  "images/lp_image.jpeg",
  "images/IMG_5266.jpeg",
  "images/IMG_3062.jpeg",
  "images/IMG_4524.jpeg",
  "images/IMG_0789.jpeg",
  "images/IMG_1874.jpeg",
  "images/IMG_3798.jpeg",
  "images/IMG_6830.jpeg",
  "images/68108820078__D32A1FA4-C36A-4F60-96F7-733B1AF08C84.jpeg",
  "images/IMG_7523.jpeg",
  "images/IMG_1048.jpeg",
  "images/IMG_0751.jpeg",
  "images/IMG_2279.jpeg",
  "images/IMG_0284.jpeg",
  "images/IMG_7516.jpeg",
  "images/IMG_0181.jpeg",
  "images/IMG_7193.jpeg",
  "images/IMG_3187.jpeg",
  "images/IMG_7081.jpeg",
  "images/IMG_0482.jpeg",
  "images/IMG_1636.jpeg",
  "images/lp_image (1).jpeg",
  "images/72300217824__A841ECA5-E12A-440D-83E4-B90F7F7AE86D.jpeg",
  "images/IMG_1729.jpeg",
  "images/IMG_0155.jpeg",
  "images/IMG_1098.jpeg",
  "images/IMG_7530.jpeg",
  "images/lp_image (2).jpeg"
];

const coreyPhotos = [
  "corey_gallery/IMG_0024.jpeg",
  "corey_gallery/IMG_0219.jpeg",
  "corey_gallery/IMG_0652.jpeg",
  "corey_gallery/IMG_2589.jpeg",
  "corey_gallery/IMG_2592.jpeg",
  "corey_gallery/IMG_3255.jpeg",
  "corey_gallery/IMG_4130.jpeg",
  "corey_gallery/IMG_4622.jpeg",
  "corey_gallery/IMG_4735.jpeg"
];

const griffPhotos = [
  "griff_gallery/71466712471__602868E9-D4FC-474D-907F-831A758D4BBA.jpeg",
  "griff_gallery/IMG_0888.jpeg",
  "griff_gallery/IMG_0921.jpeg",
  "griff_gallery/IMG_1214.jpeg",
  "griff_gallery/IMG_1386.jpeg",
  "griff_gallery/IMG_2064.jpeg",
  "griff_gallery/IMG_2277.jpeg",
  "griff_gallery/IMG_2769.jpeg",
  "griff_gallery/IMG_6723.jpeg",
  "griff_gallery/IMG_8231.jpeg"
];

window.birthdayPeople = Object.freeze({
  natalie: Object.freeze({
    key: "natalie",
    name: "Natalie",
    photos: Object.freeze(nataliePhotos)
  }),
  corey: Object.freeze({
    key: "corey",
    name: "Corey",
    photos: Object.freeze(coreyPhotos)
  }),
  griff: Object.freeze({
    key: "griff",
    name: "Griff",
    photos: Object.freeze(griffPhotos)
  })
});

window.nataliePhotos = window.birthdayPeople.natalie.photos;
