// controllers/skillController.js — CRUD operations for skills
const Skill = require('../models/Skill');

// ─── @route  POST /api/skills ─────────────────────────────────────────────────
// ─── @access Private
const createSkill = async (req, res) => {
  const { title, description, category, level } = req.body;

  if (!title || !description || !category || !level) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const skill = await Skill.create({
      title,
      description,
      category,
      level,
      userId: req.user._id,
    });

    // Populate user info for the response
    await skill.populate('userId', 'name email profileImage');

    res.status(201).json({ success: true, message: 'Skill added successfully!', data: skill });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error creating skill' });
  }
};

// ─── @route  GET /api/skills ──────────────────────────────────────────────────
// ─── @access Public (search & filter supported)
const getAllSkills = async (req, res) => {
  try {
    const { search, category, level, page = 1, limit = 12 } = req.query;

    // Build dynamic filter object
    const filter = {};

    if (category && category !== 'All') filter.category = category;
    if (level && level !== 'All') filter.level = level;

    // Text search on title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Skill.countDocuments(filter);

    const skills = await Skill.find(filter)
      .populate('userId', 'name email profileImage bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: skills,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching skills' });
  }
};

// ─── @route  GET /api/skills/mine ────────────────────────────────────────────
// ─── @access Private
const getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching your skills' });
  }
};

// ─── @route  GET /api/skills/:id ─────────────────────────────────────────────
// ─── @access Public
const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('userId', 'name email profileImage bio');
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching skill' });
  }
};

// ─── @route  PUT /api/skills/:id ─────────────────────────────────────────────
// ─── @access Private (owner only)
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    // Ensure the logged-in user owns this skill
    if (skill.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this skill' });
    }

    const { title, description, category, level } = req.body;
    skill.title = title || skill.title;
    skill.description = description || skill.description;
    skill.category = category || skill.category;
    skill.level = level || skill.level;

    const updated = await skill.save();
    res.json({ success: true, message: 'Skill updated successfully!', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating skill' });
  }
};

// ─── @route  DELETE /api/skills/:id ──────────────────────────────────────────
// ─── @access Private (owner only)
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    if (skill.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this skill' });
    }

    await skill.deleteOne();
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting skill' });
  }
};

module.exports = { createSkill, getAllSkills, getMySkills, getSkillById, updateSkill, deleteSkill };