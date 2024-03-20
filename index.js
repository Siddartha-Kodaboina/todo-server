const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const todoRouter = require('./routes/todoRouter');
require('dotenv').config();
const connectToDatabase = require('./mongoConfig');
// const 
const agendaUI = require('agenda-ui');

async function startServer() {
  const db = await connectToDatabase(); // Connect to the database
  const agenda = await require('./config/agenda')();
  /* Setting agenda for email scheduling */
  console.log("Agenda started");
  console.log('Agenda instance:', agenda);
  console.log('Agenda MongoDB connection:', agenda.mongo); 

  app.use('/agenda-ui', agendaUI(agenda, { basePath: '/', pollInterval: 10000 }));
  const port = 4000;
  // await agenda.start();
  // Check if the mongo property is defined


  
  
  // Middleware
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(bodyParser.json());

  console.log(__dirname);
  // Routes
  app.use('/api', todoRouter(db));
  // app.get('/', (req, res) => {
  //   res.status(201).json({
  //     message: 'Content retrieved successfully',
  //   });
  // });

  // if (process.env.NODE_ENV === 'production'){
  //   // Serve static files from the React app
  //   app.use(express.static(path.join(__dirname, '../react-app/build')));

  //   // Handle React routing, return all requests to React app
  //   app.get('*', function(req, res) {
  //     res.sendFile(path.join(__dirname, '../react-app/build', 'index.html'));
  //   });

  // }

  app.listen(port, () => {
    console.log('Server is listening on port 4000');
  });
}

startServer();


// Setting Variables
// const db = require('./mongoConfig.js');




// Routes
// app.use('/api', todoRouter);


// app.post('/todos',async (req, res) => {
//     let collection = await db.collection("todo");
//     let newDocument = req.body;
//     newDocument.date = new Date();
//     let result = await collection.insertOne(newDocument);
//     console.log("rreq"+req.body);
//     res.send(result).status(204);
// });

// app.get('/todos', async(req, res) => {
//     let collection = await db.collection("todo");
//     let results = await collection.find({})
      
//       .toArray();
//     res.send(results).status(200);
// });

// app.listen(port, function () {
//     console.log("Server is listening at port:" + port);
// });
 