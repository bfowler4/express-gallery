let index = 0;
let image1 = document.getElementById(`slideshow_image_1`);
let image2 = document.getElementById(`slideshow_image_2`);
let topImage = image2;
let photos = document.getElementsByClassName(`image_thumbnail`);
photos = Array.prototype.slice.call(photos);
let length = photos.length;

image1.src = photos[0].src;
image1.style.opacity = 1;
topImage.dataset.id = photos[0].dataset.id;
setTimeout(doSlideShow, 3000);
addListenersToPhotos();


function addListenersToPhotos() {
  photos.forEach((photo) => {
    photo.addEventListener(`click`, redirectToImage);
  });

  topImage.addEventListener(`click`, redirectToImage);
}

function doSlideShow() {
  index = (index + 1) % length;
  image2.src = photos[index].src;
  topImage.dataset.id = photos[index].dataset.id;
  image1.style.opacity = 0;
  image2.style.opacity = 1;
  let temp = image1;
  image1 = image2;
  image2 = temp;
  setTimeout(doSlideShow, 5000);
}

function redirectToImage() {
  location.href = `/gallery/${this.dataset.id}`;
}