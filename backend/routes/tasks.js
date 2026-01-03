const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

/**
 * ================================
 * GET ALL TASKS (PAGINATION + FILTERS)
 * ================================
 */
router.get('/', protect, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Users see only their tasks, admins see all
    if (req.user.role !== 'admin') {
      query.assignedTo = req.user.id;
    }

    // Optional filters
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ================================
 * GET TASKS BY PRIORITY
 * ================================
 */
router.get('/priority/:priority', protect, async (req, res) => {
  try {
    const query = {
      priority: req.params.priority
    };

    if (req.user.role !== 'admin') {
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ================================
 * GET SINGLE TASK
 * ================================
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (
      req.user.role !== 'admin' &&
      task.assignedTo._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ================================
 * CREATE TASK
 * ================================
 */
router.post('/', protect, async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      createdBy: req.user.id,
      assignedTo: req.body.assignedTo || req.user.id
    };

    const task = await Task.create(taskData);

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({ success: true, task: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ================================
 * UPDATE TASK
 * ================================
 */
router.put('/:id', protect, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (
      req.user.role !== 'admin' &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ================================
 * UPDATE TASK STATUS
 * ================================
 */
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (
      req.user.role !== 'admin' &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ================================
 * UPDATE TASK PRIORITY
 * ================================
 */
router.patch('/:id/priority', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (
      req.user.role !== 'admin' &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { priority: req.body.priority },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ================================
 * DELETE TASK
 * ================================
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (
      req.user.role !== 'admin' &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
