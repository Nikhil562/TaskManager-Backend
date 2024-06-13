const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const task = new Task({ ...req.body, assignedTo: req.user._id });
  await task.save();
  res.status(201).send(task);
});

router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id });
  res.send(tasks);
});

router.get('/:id', auth, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, assignedTo: req.user._id });
  if (!task) return res.status(404).send();
  res.send(task);
});

router.patch('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, assignedTo: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!task) return res.status(404).send();
  res.send(task);
});

router.delete('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, assignedTo: req.user._id });
  if (!task) return res.status(404).send();
  res.send(task);
});

module.exports = router;
