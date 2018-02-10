const express = require(`express`);
const router = express.Router();
const Photo = require(`../db/models/Photo`);
const handleError = require(`../utilities/handleError`);
module.exports = router;

router.route(`/new`)
.get((req, res) => {
  return res.render(`templates/photos/new`);
});

router.route(`/:id`)
.get((req, res) => {
  return new Photo({ id: req.params.id })
  .fetch()
  .then((photo) => {
    if (photo) {
      return res.json(photo);
    }
    throw new Error(`Photo was not found`);
  })
  .catch((err) => {
    handleError(err, res);
  });
})
.put((req, res) => {

})
.delete((req, res) => {
  return new Photo({ id: req.params.id })
  .destroy({ require: true })
  .then((success) => {
    return res.redirect(`/`);
  })
  .catch((err) => {
    handleError(err, res);
  });
});

router.route(`/`)
.post((req, res) => {
  let { author, link, description } = req.body;

  return new Photo({ author, link, description })
  .save()
  .then((photo) => {
    return res.json(photo);
  })
  .catch((err) => {
    handleError(err, res);
  });
});

router.route(`/:id/edit`)
.get((req, res) => {

});