const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
  const user = new User(req.body);
  user.password = await bcrypt.hash(user.password, 8);
  await user.save();
  const token = jwt.sign({ _id: user._id }, 'secretkey');
  res.status(201).send({ user, token });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send({ error: 'Invalid login credentials' });
  }
  const token = jwt.sign({ _id: user._id }, 'secretkey');
  res.send({ user, token });
});

module.exports = router;
