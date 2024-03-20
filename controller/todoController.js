

const todoController = (db) => {
    const { ObjectId } = require('mongodb');
    const moment = require('moment-timezone');
    const getAgenda = require('../config/agenda');
    const collection = db.collection("todo");
    // agenda = agenda(db);
    const createTodo = async (req, res) => {
        try {
            let newDocument = req.body;
            newDocument.date = new Date(); 

            console.log(newDocument.todoInfo.remainderTime, newDocument.todoInfo.timeZone);
            /* Converting the remainderTime to UTC in remainderTime exists*/
            if (newDocument.todoInfo.remainderTime) {
                newDocument.todoInfo.remainderTime = moment.tz(newDocument.todoInfo.remainderTime,  newDocument.todoInfo.timeZone).utc();
                console.log(newDocument.todoInfo.remainderTime);
                console.log(newDocument.user.email);
                const agenda = await getAgenda();
                agenda.schedule(newDocument.todoInfo.remainderTime._d, 'send email reminder', {
                    to: newDocument.user.email,
                    subject: 'Todo Reminder',
                    text: `Remember to: ${newDocument.todoInfo.task}`,
                });

            }
            const result = await collection.insertOne(newDocument);
            
            res.status(201).json({
                message: 'Todo created successfully',
                data: newDocument,
                insertedId: result.insertedId,
            });
        } catch (err) {
            console.error("An error occurred while creating the todo:", err.message);
            res.status(500).json({
                message: "An error occurred while creating the todo."
            });
        }
    };

    const getTodosByUserAndStatus = async (req, res) => {
        try {
            const uid = req.params.uid;
            const status_code = parseInt(req.params.status_code);
            
            console.log("uid, status_code", uid, status_code, typeof(status_code))
            const todos = await collection.find({
                "user.uid": uid,
                "todoInfo.status_code": status_code
            }).toArray();
    
            res.status(200).json({
                message: 'Todos retrieved successfully',
                data: todos
            });
        } catch (err) {
            console.error("An error occurred while retrieving the todos:", err.message);
            res.status(500).json({
                message: "An error occurred while retrieving the todos."
            });
        }
    };

    const getTodosByUser = async (req, res) => {
        try {
            const uid = req.params.uid;

            const todos = await collection.find({
                "user.uid": uid,
            }).toArray();

            res.status(200).json({
                message: 'Todos retrieved successfully',
                data: todos
            });
        } catch (err) {
            console.error("An error occurred while retrieving the todos:", err.message);
            res.status(500).json({
                message: "An error occurred while retrieving the todos."
            });
        }
    };

    const updateTodo = async (req, res) => {
        // try {
            const todoId = req.params.id;
            let todoInfo = req.body.todoInfo;
            console.log("updateTodo Before ", todoInfo);
            console.log("todoID : ", todoId, typeof(todoId));
            /* Converting the remainderTime to UTC in remainderTime exists*/
            if (todoInfo.remainderTime) {
                todoInfo = {...todoInfo, remainderTime: moment.tz(todoInfo.remainderTime,  todoInfo.timeZone).utc()}
                // todoInfo.remainderTime = moment.tz(todoInfo.remainderTime._d,  todoInfo.timeZone).utc();
            }
            
            console.log("After ", todoInfo);
            const result0 = await collection.findOne({
                _id: new ObjectId(todoId)
            });
            console.log(result0);
            const result = await collection.updateOne(
                { _id: new ObjectId(todoId) },
                { $set: { 
                    "todoInfo": todoInfo
                } } 
            );
            
            
            if (result.modifiedCount === 0) {
                throw new Error('Todo not found or status not updated');
            }

            res.status(200).json({
                message: 'Todo status updated successfully',
            });
        // } catch (err) {
        //     console.error("An error occurred while updating the todo status:", err.message);
        //     res.status(500).json({
        //         message: "An error occurred while updating the todo status."
        //     });
        // }
    };

    return {
        createTodo,
        getTodosByUserAndStatus,
        getTodosByUser,
        updateTodo 
    };
}   

module.exports = todoController;

