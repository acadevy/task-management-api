const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const taskController = require('../controllers/taskController');

router.post('/tasks', auth, taskController.createTask);
router.get('/tasks', auth, taskController.getTasks);
router.get('/tasks/:id', auth, taskController.getTaskById);
router.patch('/tasks/:id', auth, taskController.updateTaskById);
router.delete('/tasks/:id', auth, taskController.deleteTaskById);

module.exports = router;