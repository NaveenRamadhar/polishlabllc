const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
  });
});

const mobileLocationToggle = document.getElementById("mobileLocationToggle");

const mobileLocationMenu = document.getElementById("mobileLocationMenu");

if (mobileLocationToggle && mobileLocationMenu) {
  mobileLocationToggle.addEventListener("click", () => {
    const isOpen =
      mobileLocationToggle.getAttribute("aria-expanded") === "true";

    mobileLocationToggle.setAttribute("aria-expanded", String(!isOpen));

    mobileLocationToggle.classList.toggle("active");
    mobileLocationMenu.classList.toggle("active");
  });
}
/* =======================================
   POLISH LAB Gift Card Slider
======================================= */

const giftCards = [
  "giftcard.png",
  "giftcard0.png",
  "giftcard1.png",
  "giftcard2.png",
  "giftcard3.png",
  "giftcard4.png",
  "giftcard5.png",
  "giftcard6.png",
  "giftcard7.png",
];

let currentGift = 0;

const giftImage = document.getElementById("giftCardImage");
const giftDots = document.querySelectorAll(".gift-dot");

function updateGiftCard() {
  giftImage.style.opacity = 0;

  setTimeout(() => {
    giftImage.src = giftCards[currentGift];

    giftDots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentGift);
    });

    giftImage.style.opacity = 1;
  }, 150);
}

document.querySelector(".gift-next").addEventListener("click", () => {
  currentGift++;

  if (currentGift >= giftCards.length) {
    currentGift = 0;
  }

  updateGiftCard();
});

document.querySelector(".gift-prev").addEventListener("click", () => {
  currentGift--;

  if (currentGift < 0) {
    currentGift = giftCards.length - 1;
  }

  updateGiftCard();
});

giftDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentGift = index;

    updateGiftCard();
  });
});
