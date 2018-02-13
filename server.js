const express = require(`express`);
const session = require(`express-session`);
const passport = require(`passport`);
const LocalStrategy = require(`passport-local`);
const bcrypt = require(`bcrypt`);
const Redis = require(`connect-redis`)(session);
const bodyParser = require(`body-parser`);
const handlebars = require(`express-handlebars`);
const methodOverride = require(`method-override`);
const User = require(`./db/models/User`);
const Photo = require(`./db/models/Photo`);
const server = express();

const PORT = process.env.PORT || 8080;
const saltRounds = 12;

const galleryRoute = require(`./routes/gallery`);
const usersRoute = require(`./routes/users`);

server.engine(`.hbs`, handlebars({ defaultLayout: `main`, extname: `.hbs` }));
server.set(`view engine`, `.hbs`);

server.use(`/gallery`, galleryRoute);

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(session({
  store: new Redis(),
  secret: `keyboard cat`,
  resave: false,
  saveUninitialized: false
}));
server.use(express.static(`public`));

server.use(passport.initialize());
server.use(passport.session());

server.use(`/users/:user_id/:photo_id/edit`, methodOverride(`_method`));

server.use(`/users`, usersRoute);

server.get(`/`, (req, res) => {
  return Photo
  .forge()
  .orderBy(`id`, `ASC`)
  .fetchAll()
  .then((photos) => {
    photos.models.slice(0, photos.models.length - 1).forEach((curr, index) => {
      if ((index + 1) % 3 === 0) {
        curr.attributes.addLine = true;
      } else {
        curr.attributes.addLine = false;
      }
    });
    return res.render(`templates/photos/index`, {data: photos.models});
  })
  .catch((err) => {
    return res.json({ message: err.message });
  });
});

server.listen(PORT, (err) => {
  console.log(`Server listening on port: ${PORT}`);
});