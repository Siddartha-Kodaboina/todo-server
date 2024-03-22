const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const todoRouter = require('./routes/todoRouter');
require('dotenv').config();
const connectToDatabase = require('./mongoConfig');
// const 
const agendaUI = require('agenda-ui');
const getAgenda = require('./config/agenda');

async function startServer() {
  const db = await connectToDatabase(); // Connect to the database
  /* Setting agenda for email scheduling */
  const agenda = await getAgenda();

  app.use('/agenda-ui', agendaUI(agenda, { basePath: '/', pollInterval: 10000 }));
  const port = 4000;

  // Middleware
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(bodyParser.json());

  // Routes
  app.use('/api', todoRouter(db, agenda));
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
 