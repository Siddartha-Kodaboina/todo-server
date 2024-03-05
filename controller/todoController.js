require('dotenv').config();
const { ObjectId } = require('mongodb');
const connectToDatabase = require('../mongoConfig');

const createTodo = async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("todo"); 
        req.body
        let newDocument = req.body;
        newDocument.date = new Date(); 
        const result = await collection.insertOne(newDocument);

        console.log("Request Body:", newDocument);
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
        const db = await connectToDatabase();
        const collection = db.collection("todo");
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
        const db = await connectToDatabase();
        const collection = db.collection("todo");
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

const updateTodoStatus = async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("todo");
        const todoId = req.params.id;
        const newStatus = req.body.status;
        const newStatusCode = parseInt(req.body.status_code);

        const result = await collection.updateOne(
            { _id: new ObjectId(todoId) },
            { $set: { 
                "todoInfo.status": newStatus,
                "todoInfo.status_code": newStatusCode
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

module.exports = {
    createTodo,
    getTodosByUserAndStatus,
    getTodosByUser,
    updateTodoStatus 
};