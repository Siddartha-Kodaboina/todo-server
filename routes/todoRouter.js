const express = require('express');
const router = express.Router();
const todoController = require('../controller/todoController');

// Routes

// post: create a new todo
router.post('/todo', todoController.createTodo);

// get: read a todo By user and status code
router.get('/todo/:uid/:status_code', todoController.getTodosByUserAndStatus);

// get: read a todo By user id
router.get('/todo/:uid', todoController.getTodosByUser);

// put: update a todo
router.put('/todo/:id', todoController.updateTodoStatus);

module.exports = router;
