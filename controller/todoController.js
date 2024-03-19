const { ObjectId } = require('mongodb');

const todoController = (db) => {
    const collection = db.collection("todo");

    const createTodo = async (req, res) => {
        try {
            let newDocument = req.body;
            newDocument.date = new Date(); 
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
        try {
            const todoId = req.params.id;
            const todoInfo = req.body.todoInfo;

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

