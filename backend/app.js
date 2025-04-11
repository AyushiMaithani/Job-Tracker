require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const config = require('./config/config');
const cors = require('cors');
const app = express();


const PORT = config.port;
connectDB();

//middlewares
app.use(cors());
app.use(express.json());


//root endpoint
app.get('/', (req, res) => {
    res.json ({message: 'Hello from Server!'});
});

//other endpoints
app.use('/api/jobs', require('./routes/jobRoute'));


//server
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});

