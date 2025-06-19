const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controllers
const {
  getIdeas,
  getIdea,
  createIdea,
  updateIdea,
  deleteIdea,
} = require('../controllers/ideas');

// Get all ideas and create new idea
router
  .route('/')
  .get(protect, getIdeas)
  .post(protect, createIdea);

// Get, update, and delete single idea
router
  .route('/:id')
  .get(protect, getIdea)
  .put(protect, updateIdea)
  .delete(protect, deleteIdea);

module.exports = router;