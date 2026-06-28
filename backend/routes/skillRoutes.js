// routes/skillRoutes.js — Skill CRUD endpoints
const express = require('express');
const router = express.Router();
const {
  createSkill,
  getAllSkills,
  getMySkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllSkills);
router.get('/:id', getSkillById);

// Private routes (require JWT)
router.post('/', protect, createSkill);
router.get('/user/mine', protect, getMySkills);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;