const express = require(`express`);
const server = express();
const bodyParser = require(`body-parser`);
const handlebars = require(`express-handlebars`);

const PORT = process.env.PORT || 8080;

const galleryRoute = require(`./routes/gallery`);

server.engine(`.hbs`, handlebars({ defaultLayout: `main`, extname: `.hbs` }));
server.set(`view engine`, `.hbs`);

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use(`/gallery`, galleryRoute);

server.get(`/`, (req, res) => {
  res.send(`heres a list of all the photos`);
});

server.listen(PORT, (err) => {
  console.log(`Server listening on port: ${PORT}`);
});