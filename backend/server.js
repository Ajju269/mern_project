const express = require('express');
const session = require('express-session');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');

const app = express();
const port = 5000;

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 1 day — keeps you logged in across browser restarts while developing
  }
}));

app.use('/api', authRoutes);
app.use('/api', requestRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});