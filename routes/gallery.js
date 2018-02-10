const express = require(`express`);
const router = express.Router();
const Photo = require(`../db/models/Photo`);
module.exports = router;


router.route(`/:id`)
.get((req, res) => {

})
.put((req, res) => {

})
.delete((req, res) => {

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
    return res.status(400).json({ message: err.message });
  });
});

router.route(`/new`)
.get((req, res) => {
  return res.send(`this is a form to post a new photo`);
});

router.route(`/:id/edit`)
.get((req, res) => {

});