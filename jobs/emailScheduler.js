const Agenda = require('agenda');
const sendEmail = require('../services/emailService');
const { MongoClient } = require('mongodb');

const password = encodeURIComponent(process.env.MONGO_DB_PASSWORD.trim());
const connectionString = `mongodb+srv://stevesiddu49:${password}@devcluster.konfbv0.mongodb.net/?retryWrites=true&w=majority&appName=DevCluster`;
// const client = new MongoClient(connectionString);

module.exports = async () => {
  // const agenda = new Agenda({ mongo: dbConnection });
  const agenda = new Agenda({ db: { address: connectionString, collection: 'agendaJobs' } });
  
  agenda.define('send email reminder', async (job) => {
    // const { to, subject, text } = job.attrs.data;
    // await sendEmail(to, subject, text);
    const { to, subject, html } = job.attrs.data;
    await sendEmail(to, subject, html);
  });

    await agenda.start();
  return agenda;
};
