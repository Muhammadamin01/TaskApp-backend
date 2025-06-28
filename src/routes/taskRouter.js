const express = require('express');
const { addTask, updateTask, deleteTask, showOneTask, getAllTasks } = require('../controller/taskController');
const authMiddleware = require('../middleware/authMIddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', addTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/:id', showOneTask);
router.get('/', getAllTasks);

module.exports = router;