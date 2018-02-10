const express = require(`express`);
const server = express();
const bodyParser = require(`body-parser`);
const handlebars = require(`express-handlebars`);
const methodOverride = require(`method-override`);
const Photo = require(`./db/models/Photo`);

const PORT = process.env.PORT || 8080;

const galleryRoute = require(`./routes/gallery`);

server.engine(`.hbs`, handlebars({ defaultLayout: `main`, extname: `.hbs` }));
server.set(`view engine`, `.hbs`);

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use(`/gallery/:id`, methodOverride(`_method`));

server.use(`/gallery`, galleryRoute);

server.get(`/`, (req, res) => {
  return Photo
  .fetchAll()
  .then((photos) => {
    return res.render(`templates/photos/index`, {data: photos.models});
  })
  .catch((err) => {
    return res.json({ message: err.message });
  });
});

server.listen(PORT, (err) => {
  console.log(`Server listening on port: ${PORT}`);
});