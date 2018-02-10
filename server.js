const express = require(`express`);
const server = express();

const PORT = process.env.PORT || 8080;

server.get(`/`, (req, res) => {
  return res.send(`Smoke test`);
});

server.listen(PORT, (err) => {
  console.log(`Server listening on port: ${PORT}`);
});