const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://tsehayneshbiruh2:f8lfa6Yl1q1nM2eX@cluster0.g61dl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
});

// Task model
const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', TaskSchema);

// Routes

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
  const task = new Task({
    text: req.body.text,
  });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.text = req.body.text !== undefined ? req.body.text : task.text;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});