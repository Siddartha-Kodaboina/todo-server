

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
            }
            const result = await collection.insertOne(newDocument);
            console.log(result);
            const insertedDoc = await collection.findOne({_id: result.insertedId});
            console.log(insertedDoc);
            console.log(insertedDoc._id, typeof(insertedDoc._id));
            if (insertedDoc.todoInfo.remainderTime) {
                // console.log(insertedDoc.todoInfo.remainderTime); 
                console.log(insertedDoc.user.email);
                const agenda = await getAgenda();
                // agenda.schedule(newDocument.todoInfo.remainderTime._d, 'send email reminder', {
                //     to: newDocument.user.email,
                //     subject: 'Todo Reminder',
                //     text: `Remember to: ${newDocument.todoInfo.task}`,
                // });
                agenda.schedule(insertedDoc.todoInfo.remainderTime._d, 'send email reminder', {
                    _id: insertedDoc._id,
                    to: insertedDoc.user.email,
                    subject: 'Your Task Awaits You 🌟, Lets Get It Done ✅',
                    html: `Hi!<br><br>Just a swift nudge about the task you planned to conquer. Here it is:<br><br>Task: <b>${insertedDoc.todoInfo.task}</b><br>${insertedDoc.todoInfo.description}<br><br>Ready to check this off? You've got the skills to make it happen!, Let's Go 👊.<br><br>Go for it,<br>Your Partner in Getting Things Done ✨`,
                });
            }
            
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
        try {
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

            // First, find and cancel the existing job
            const agenda = await getAgenda();
            await agenda.cancel({ 'data._id': result0._id });
            
            // Then schedule a new job with the updated time
            agenda.schedule(todoInfo.remainderTime, 'send email reminder', {
                _id: new ObjectId(todoId),
                to: result0.user.email,
                subject: 'Your Task Awaits You 🌟, Lets Get It Done ✅',
                html: `Hi!<br><br>Just a swift nudge about the task you planned to conquer. Here it is:<br><br>Task: <b>${todoInfo.todoInfo.task}</b><br>${todoInfo.todoInfo.description}<br><br>Ready to check this off? You've got the skills to make it happen!, Let's Go 👊.<br><br>Go for it,<br>Your Partner in Getting Things Done ✨`,
            });

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
        } catch (err) {
            console.error("An error occurred while updating the todo status:", err.message);
            res.status(500).json({
                message: "An error occurred while updating the todo status."
            });
        }
    };

    return {
        createTodo,
        getTodosByUserAndStatus,
        getTodosByUser,
        updateTodo 
    };
}   

module.exports = todoController;

