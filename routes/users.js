var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile/:username', (req, res) => {
  const {username} = req.params;
  res.render('users/profile', {username: username});
});

router.get('/create', (req, res) => res.render('users/form'));

router.post('/', async (req, res) => {
  const {db} = req.app.locals;
  const {username, email, password} = req.body;
  const user = await db.collection('users').insertOne({ username: username, email: email, password: password });
  console.log(user);
  res.redirect('/users/profile/' + username);
});

module.exports = router;
