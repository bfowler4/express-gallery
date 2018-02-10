const express = require(`express`);
const router = express.Router();
module.exports = router;

router.get(`/`, (req, res) => {
  return res.send(`Smoke test`);
});

router.route(`/:id`)
.get((req, res) => {

})
.put((req, res) => {

})
.delete((req, res) => {

});
