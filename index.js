const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./mongoConfig.js');

const port = 4000;

app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
  
    next();
  });

// Parses the text as url encoded data
app.use(bodyParser.urlencoded({ extended: true }));
 
// Parses the text as json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World, from express');
})

// app.post('/addTodo',async (req, res) => {
//     let collection = await db.collection("todo");
//     let newDocument = req.body;
//     newDocument.date = new Date();
//     let result = await collection.insertOne(newDocument);
//     console.log("rreq"+req.body);
//     res.send(result).status(204);
// });

// app.get('/getTodos', async(req, res) => {
//     let collection = await db.collection("todo");
//     let results = await collection.find({})
      
//       .toArray();
//     res.send(results).status(200);
// });

app.listen(port, function () {
    console.log("Server is listening at port:" + port);
});
 