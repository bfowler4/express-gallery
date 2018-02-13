let index = 1;
let image1 = document.getElementById(`slideshow_image_1`);
let image2 = document.getElementById(`slideshow_image_2`);
let photos = document.getElementsByClassName(`image_thumbnail`);
photos = Array.prototype.slice.call(photos);
let length = photos.length;

image1.src = photos[0].src;
image1.style.opacity = 1;
image1.dataset.id = photos[0].dataset.id;
setTimeout(fadeOut, 3000);
setTimeout(fadeIn, 4000);
//setTimeout(doSlideShow, 3000);
addListenersToPhotos();


function addListenersToPhotos() {
  photos.forEach((photo) => {
    photo.addEventListener(`click`, redirectToImage);
  });

  image1.addEventListener(`click`, redirectToImage);
  image2.addEventListener(`click`, redirectToImage);
}

function doSlideShow() {

}

function fadeIn() {
  image1.src = photos[index].src;
  image1.dataset.id = photos[index].dataset.id;
  image1.style.opacity = 1;
  index = (index + 1) % length;
  setTimeout(fadeIn, 4000);
}

function fadeOut() {
  image1.style.opacity = 0;
  setTimeout(fadeOut, 4000);
}

// function doSlideShow() {
//   console.log(image1.dataset.id);
//   image2.src = photos[index].src;
//   image2.dataset.id = photos[index].dataset.id;
//   image1.style.opacity = 0;
//   image2.style.opacity = 1;
//   index = (index + 1) % length;
//   let temp = image1;
//   image1 = image2;
//   image2 = temp;
//   setTimeout(doSlideShow, 5000);
// }

function redirectToImage() {
  console.log(this);
  location.href = `/gallery/${this.dataset.id}`;
}