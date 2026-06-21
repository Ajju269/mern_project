const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
// add this near the top, with your other requires
// (bcrypt and User are already imported above)

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // bcrypt.compare hashes the entered password and checks it against the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.user = {
      userType: user.userType,
      username: user.username,
      email: user.email,
      phone: user.phone
    };

    res.status(200).json({ message: 'Login successful!', userType: user.userType });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

router.get('/check-auth', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});
router.post('/signup', async (req, res) => {
  try {
    const { userType, username, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving — NEVER store plain text passwords
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user using our Mongoose model
    const newUser = new User({
      userType,
      username,
      email,
      phone,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'Signup successful! Please login.' });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'An error occurred during signup.' });
  }
});

module.exports = router;