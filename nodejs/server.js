const express = require('express');
const app = express();
const cors = require('cors');   

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
  }));
const pollingRouter = require('./routes/polling');

app.use(express.json());
app.use('/poll', pollingRouter);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});