const express = require(`express`);
const router = express.Router();
const User = require(`../db/models/User`);
const Photo = require(`../db/models/Photo`);
const handleError = require(`../utilities/handleError`);

module.exports = router;

// Get new user form and handle adding new user
router.route(`/register`)
.get((req, res) => {
  return res.render(`templates/users/register`);
})
.post((req, res) => {
  let { email, username, password } = req.body;
  return new User({ email, username, password})
  .save()
  .then((user) => {
    return res.redirect(`/users/${user.attributes.id}`);
  })
  .catch((err) => {
    return handleError(err, res);
  });
});

router.route(`/login`)
.get((req, res) => {
  return res.render(`templates/users/login`);
})
.post((req, res) => {
  return res.json(req.body);
});

// Get form to add new photo
router.route(`/:id/new`)
.get((req, res) => {
  return res.render(`templates/users/new`, { id: req.params.id });
});

// Get all photos from user and handle add photo request
router.route(`/:id`)
.get((req, res) => {
  return new User({ id: req.params.id })
  .fetch({ withRelated: [`photos`] })
  .then((user) => {
    return res.json(user);
  })
  .catch((err) => {
    handleError(err, res);
  });
})
.post((req, res) => {
  let { author, link, description } = req.body;

  return new Photo({ author, link, description, user_id: req.params.id })
  .save()
  .then((photo) => {
    return res.json(photo);
  })
  .catch((err) => {
    return handleError(err, res);
  });
});


// Get form to edit photo, handle edit request and delete request
router.route(`/:user_id/:photo_id/edit`)
.get((req, res) => {
  return new Photo({ id: req.params.photo_id })
  .fetch()
  .then((photo) => {
    if (photo) {
      return res.render(`templates/users/edit`, photo.attributes);
    }
    throw new Error(`Photo was not found`);
  })
  .catch((err) => {
    handleError(err, res);
  });
})
.put((req, res) => {
  return new Photo({ id: req.params.photo_id })
  .save(req.body, { path: true, require: true })
  .then((success) => {
    return res.redirect(`/users/${req.params.user_id}`);
  })
  .catch((err) => {
    handleError(err, res);
  });
})
.delete((req, res) => {
  return new Photo({ id: req.params.photo_id })
  .destroy({ require: true })
  .then((success) => {
    return res.redirect(`/users/${req.params.user_id}`);
  })
  .catch((err) => {
    handleError(err, res);
  });
});