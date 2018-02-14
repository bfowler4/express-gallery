const express = require(`express`);
const router = express.Router();
const Photo = require(`../db/models/Photo`);
const handleError = require(`../utilities/handleError`);
const { validatePhotoForInsert } = require(`../utilities/validatePhoto`);
module.exports = router;


router.route(`/:id`)
.get((req, res) => {
  return Photo
  .forge()
  .orderBy(`id`, `ASC`)
  .fetchAll()
  .then((photos) => {
    let photo = findAndRemovePhoto(photos.models, req.params.id);
    if (photo) {
      let photosObject = {};
      photosObject.mainPhoto = photo.attributes;
      photosObject.sidePhotos = photos.models;
      photosObject.user = req.user;

      return res.render(`templates/photos/photo`, photosObject);
    } else {
      throw new Error(`Photo was not found`);
    }
  })
  .catch((err) => {
    handleError(err, res);
  })
});

function findAndRemovePhoto(photos, id) {
  for (let i = 0; i < photos.length; i ++) {
    if (photos[i].attributes.id == id) {
      let photo = photos[i];
      photos.splice(i, 1);
      return photo;
    }
  }

  return false;
}