const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./database/db');
const { initGameEngine } = require('./games/gameEngine');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Connect to Database
connectDB();

// Make io globally accessible
global.io = io;

// Initialize Game loop & sockets
initGameEngine(io);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin Web View Dashboard Route
app.get('/admin', async (req, res) => {
  try {
    const User = require('./users/User');
    const Round = require('./rounds/Round');
    const Prediction = require('./games/Prediction');

    const totalUsers = await User.countDocuments();
    const usersList = await User.find().select('-password').sort({ createdAt: -1 });
    const totalRounds = await Round.countDocuments();
    const activeRound = await Round.findOne({ status: 'active' });
    const recentPredictions = await Prediction.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .limit(10);

    res.render('dashboard', {
      stats: { totalUsers, totalRounds },
      activeRound,
      users: usersList,
      recentPredictions
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// APIs Routes Setup
app.use('/api/auth', require('./auth/authController'));
app.use('/api/users', require('./users/usersController'));
app.use('/api/game', require('./games/gamesController'));
app.use('/api/admin', require('./admin/adminController'));

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Number Prediction Game Real Backend API!' });
});

// Websocket Events Test
io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Real Backend Server running on port ${PORT}`);
});
