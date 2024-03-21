const todoRouter = (db, agenda) => {
    const express = require('express');
    const router = express.Router();
    const todoController = require('../controller/todoController')(db, agenda);

    // Routes
    router.get('/check', (req, res)=> {
        try{
            res.status(200).json({
                message: 'It is connected and working successfully',
            });
        }
        catch{
            console.error("An error occurred", err.message);
            res.status(500).json({
                message: "An error occurred/Connection failed.."
            });
        }
    });

    // post: create a new todo
    router.post('/todo', todoController.createTodo);

    // get: read a todo By user and status code
    router.get('/todo/:uid/:status_code', todoController.getTodosByUserAndStatus);

    // get: read a todo By user id
    router.get('/todo/:uid', todoController.getTodosByUser);

    // put: update a todo
    router.put('/todo/:id', todoController.updateTodo);

    return router;
}

module.exports = todoRouter;