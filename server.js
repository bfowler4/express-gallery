const express = require(`express`);
const server = express();

const PORT = process.env.PORT || 8080;

const galleryRoute = require(`./routes/gallery`);

server.use(`/gallery`, galleryRoute);

server.listen(PORT, (err) => {
  console.log(`Server listening on port: ${PORT}`);
});