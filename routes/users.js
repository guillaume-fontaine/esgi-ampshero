var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:username', (req, res) => {
  const {username} = req.params;
  res.render('users/profile', {username: username})
});

module.exports = router;
