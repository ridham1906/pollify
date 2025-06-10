require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const {connectToSocket, getIo} = require('./sockets/socketManager');
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const authRoute = require('./routes/authRoute');
const pollRoute = require('./routes/pollRoute');
const usersRoute = require('./routes/usersRoute');

app.use(cors({
    origin: [`${process.env.CLIENT_URL}`],
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoute);
app.use('/api/polls', pollRoute);
app.use('/api/user', usersRoute);

app.set('io', getIo());

app.get('/', (req, res) => {
    res.json({msg: 'server is working :)'}); 
});

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }

    connectToSocket(server);
    console.log("websocket intialized");

    server.listen(PORT, ()=> {
        console.log(`Server is running on ${PORT}`);
    })
};

startServer();
