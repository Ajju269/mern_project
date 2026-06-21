const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const requireAuth = require('../middleware/auth');

router.post('/requests', requireAuth, async (req, res) => {
  try {
    const newRequest = new Request({
      ...req.body,
      username: req.session.user.username,
      email: req.session.user.email,
      phone: req.session.user.phone
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request saved!' });

  } catch (error) {
    console.error('Error saving request:', error);
    res.status(500).json({ message: 'Failed to save request.' });
  }
});

router.get('/requests', requireAuth, async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests.' });
  }
});

// Requests submitted by the currently logged-in user only — used to show status updates
router.get('/requests/mine', requireAuth, async (req, res) => {
  try {
    const requests = await Request.find({ email: req.session.user.email }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching my requests:', error);
    res.status(500).json({ message: 'Failed to fetch your requests.' });
  }
});

router.patch('/requests/:id', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Failed to update request.' });
  }
});

module.exports = router;