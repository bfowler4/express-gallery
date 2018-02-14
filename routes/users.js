const express = require(`express`);
const router = express.Router();
const User = require(`../db/models/User`);
const Photo = require(`../db/models/Photo`);
const handleError = require(`../utilities/handleError`);

// Authentication modules
const passport = require(`passport`);
const LocalStrategy = require(`passport-local`);
const bcrypt = require(`bcrypt`);
const session = require(`express-session`);
const Redis = require(`connect-redis`)(session);

const saltRounds = 12;

module.exports = router;


// Passport setup
passport.serializeUser((user, done) => {
  console.log(`serializing`);
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  console.log(`deserializing`);
  return new User({ id: user.id })
  .fetch()
  .then((user) => {
    user = user.toJSON();
    return done(null, {
      id: user.id,
      username: user.username
    });
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  new User({ username: username }).fetch()
  .then((user) => {
    if (user === null) {
      return done(null, false, { message: `bad username or password` });
    } else {
      user = user.toJSON();
      bcrypt.compare(password, user.password)
      .then((res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: `bad username or password` });
        }
      });
    }
  })
  .catch((err) => { console.log(`error: `, err); });
}));


// ROUTING
// Get new user form and handle adding new user
router.route(`/register`)
.get((req, res) => {
  return res.render(`templates/users/register`, { user: req.user });
})
.post((req, res) => {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      let { email, username } = req.body;
      return new User({ email, username, password: hash })
      .save()
      .then((user) => {
        return res.redirect(`/users/login`);
      })
      .catch((err) => { handleError(err, res); });
    });
  });
});

// Login and logout
router.route(`/login`)
.get((req, res) => {
  if (req.user) {
    req.logout();
  }
  return res.render(`templates/users/login`);
})
.post(passport.authenticate(`local`, { failureRedirect: `/users/login` }), (req, res) => {
  return res.redirect(`/users/${req._passport.session.user.id}`);
});

router.get(`/logout`, (req, res) => {
  req.logout();
  return res.redirect(`/`);
});

// Get form to add new photo
router.route(`/:user_id/new`)
.get(isAuthenticated, (req, res) => {
  return res.render(`templates/users/new`, { id: req.params.user_id });
});

// Get all photos from user and handle add photo request
router.route(`/:user_id`)
.get(isAuthenticated, (req, res) => {
  return new User({ id: req.params.user_id })
  .fetch({ withRelated: [`photos`] })
  .then((user) => {
    user = user.toJSON();
    user.photos.slice(0, user.photos.length - 1).forEach((curr, index) => {
      if ((index + 1) % 3 === 0) {
        curr.addLine = true;
      } else {
        curr.addLine = false;
      }
    });
    return res.render(`templates/users/index`, { data: user.photos });
  })
  .catch((err) => {
    handleError(err, res);
  });
})
.post(isAuthenticated, (req, res) => {
  let { author, link, description } = req.body;

  return new Photo({ author, link, description, user_id: req.params.user_id })
  .save()
  .then((photo) => {
    return res.redirect(`/users/${req.params.user_id}`);
  })
  .catch((err) => {
    return handleError(err, res);
  });
});

// Get form to edit photo, handle edit request and delete request
router.route(`/:user_id/:photo_id/edit`)
.get(isAuthenticated, (req, res) => {
  return new Photo({ id: req.params.photo_id, user_id: req.params.user_id })
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
.put(isAuthenticated, (req, res) => {
  req.body.description = req.body.description.replace(/[\r\n]+/g, ` `);
  return new Photo({ id: req.params.photo_id, user_id: req.params.user_id })
  .save(req.body, { path: true, require: true })
  .then((success) => {
    return res.redirect(`/users/${req.params.user_id}`);
  })
  .catch((err) => {
    handleError(err, res);
  });
})
.delete(isAuthenticated, (req, res) => {
  return new Photo({ id: req.params.photo_id, user_id: req.params.user_id })
  .destroy({ require: true })
  .then((success) => {
    return res.redirect(`/users/${req.params.user_id}`);
  })
  .catch((err) => {
    handleError(err, res);
  });
});

function isAuthenticated (req, res, next) {
  if(req.isAuthenticated()) {
    let sessionUserId = req._passport.session.user.id;
    if (req.params.user_id == sessionUserId) {
      return next();
    }
    return res.redirect(`/users/${sessionUserId}`);
  }
  return res.redirect('/'); 
}
