

const todoController = (db, agenda) => {
    const { ObjectId } = require('mongodb');
    const moment = require('moment-timezone');
    
    const collection = db.collection("todo");
    // agenda = agenda(db);
    const createTodo = async (req, res) => {
        // try {
            let newDocument = req.body;
            newDocument.date = new Date(); 
            /* Converting the remainderTime to UTC in remainderTime exists*/
            if (newDocument.todoInfo.remainderTime) {
                newDocument.todoInfo.remainderTime = moment.tz(newDocument.todoInfo.remainderTime,  newDocument.todoInfo.timeZone).utc();
            }
            const result = await collection.insertOne(newDocument);
            if (newDocument && newDocument.todoInfo && newDocument.todoInfo.remainderTime && newDocument.todoInfo.remainderTime.isAfter(moment.utc())) {
                // console.log(insertedDoc.todoInfo.remainderTime); 
                // console.log(insertedDoc.user.email);
                // const agenda = await getAgenda();
                // agenda.schedule(newDocument.todoInfo.remainderTime._d, 'send email reminder', {
                //     to: newDocument.user.email,
                //     subject: 'Todo Reminder',
                //     text: `Remember to: ${newDocument.todoInfo.task}`,
                // });
                const insertedDoc = await collection.findOne({_id: result.insertedId});
                agenda.schedule(newDocument.todoInfo.remainderTime._d, 'send email reminder', {
                    _id: insertedDoc._id,
                    to: newDocument.user.email,
                    subject: 'Your Task Awaits You 🌟, Lets Get It Done ✅',
                    html: `Hi!<br><br>Just a swift nudge about the task you planned to conquer. Here it is:<br><br>Task: <b>${newDocument.todoInfo.task}</b><br>${newDocument.todoInfo.description}<br><br>Ready to check this off? You've got the skills to make it happen!, Let's Go 👊.<br><br>Go for it,<br>Your Partner in Getting Things Done ✨`,
                });
            }
            
            res.status(201).json({
                message: 'Todo created successfully',
                data: newDocument,
                insertedId: result.insertedId,
            });
        // } catch (err) {
        //     console.error("An error occurred while creating the todo:", err.message);
        //     res.status(500).json({
        //         message: "An error occurred while creating the todo."
        //     });
        // }
    };

    const getTodosByUserAndStatus = async (req, res) => {
        try {
            const uid = req.params.uid;
            const status_code = parseInt(req.params.status_code);
            
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
            const todo = req.body.todo;
            let todoInfo = todo.todoInfo;
            /* Converting the remainderTime to UTC in remainderTime exists*/
            if (todoInfo.remainderTime) {
                todoInfo = {...todoInfo, remainderTime: moment.tz(todoInfo.remainderTime,  todoInfo.timeZone).utc()}
                // todoInfo.remainderTime = moment.tz(todoInfo.remainderTime._d,  todoInfo.timeZone).utc();
            }            

            const result = await collection.updateOne(
                { _id: new ObjectId(todoId) },
                { $set: { 
                    "todoInfo": todoInfo
                } } 
            );
            
            // First, find and cancel the existing job
            // const agenda = await getAgenda();
            await agenda.cancel({ 'data._id': new ObjectId(todoId) });
            
            if (todoInfo.remainderTime && todoInfo.remainderTime.isAfter(moment.utc())){
                // console.log("toRemTime: ", todoInfo.remainderTime._d);
                // Then schedule a new job with the updated time
                agenda.schedule(todoInfo.remainderTime._d, 'send email reminder', {
                    _id: new ObjectId(todoId),
                    to: todo.user.email,
                    subject: 'Your Task Awaits You 🌟, Lets Get It Done ✅',
                    html: `Hi!<br><br>Just a swift nudge about the task you planned to conquer. Here it is:<br><br>Task: <b>${todoInfo.task}</b><br>${todoInfo.description}<br><br>Ready to check this off? You've got the skills to make it happen!, Let's Go 👊.<br><br>Go for it,<br>Your Partner in Getting Things Done ✨`,
                });
            }
            
            
            
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

