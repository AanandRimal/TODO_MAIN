const Todo = require('../models/TodoModel')
const Category = require('../models/CategoryModel');
const Priority=require('../models/PriorityModel');
const User=require('../models/userModel');
const express = require('express');
const router = express.Router();


const mongoose = require('mongoose')



// get all todos assigned to or created by the user
const getTodos = async (req, res) => {
  const user_id = req.user._id;
  try {
    const todos = await Todo.find({
      $or: [{ user_id }, { assignee: user_id }],
    }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve todos' });
  }
};


// get all todos assinged to another user to show in assigned tab
// const getAssginedTodos=async(req,res=>{
//   const user_id=req.user._id;
//   const assignedTabTodos=await Todo.find({})

// })

// get a single workout
const getTodo = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Todo'})
  }

  const todo= await Todo.findById(id)

  if (!todo) {
    return res.status(404).json({error: 'No such Todo'})
  }

  res.status(200).json(todo)
}

// create a new workout
// create a new todo
const createTodo = async (req, res) => {
  const { title, description, date, categoryName, priorityId: reqPriorityId, asigneeId } = JSON.parse(req.body.todo);;

  let emptyFields = [];

  // Check for empty fields
  console.log(title)
  if (!title) {
    emptyFields.push('title');
  }
  if (!description) {
    emptyFields.push('description');
  }
  if (!date) {
    emptyFields.push('date');
  }
  if (!categoryName) {
    emptyFields.push('categoryName');
  }
  if (!reqPriorityId) {
    emptyFields.push('priorityId');
  }
  if (!asigneeId) {
    emptyFields.push('asigneeId');
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
  }

  try {
    const user_id = req.user._id;

    // Find the category by ID
    const category = await Category.findById(categoryName);

    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Find the priority by ID
    const priority = await Priority.findById(reqPriorityId);

    if (!priority) {
      return res.status(400).json({ error: 'Invalid priority' });
    }
    const asignee = await User.findById(asigneeId);

    if (!asignee) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    const categoryId = category._id;
    const priorityId = priority._id;
    const assignee = asignee._id;

    let file = null;

    if (req.file) {
      // from the multer which send the file we extract the path and create the todo and store in databse filepath
      file = req.file.path; // Use the path or other relevant information about the uploaded file
    }
console.log(file);
    // Create the todo with the category and priority IDs and file path
    const todo = await Todo.create({ title, description, date, user_id, categoryId, priorityId, assignee, file });

    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




// delete a workout
const deleteTodo = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such Todo'})
  }

  const todo = await Todo.findOneAndDelete({_id: id})

  if(!Todo) {
    return res.status(400).json({error: 'No such Todo'})
  }

  res.status(200).json(todo)
}

// update a workout
const updateTodo = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such todo'})
  }

  const todo = await Todo.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!Todo) {
    return res.status(400).json({error: 'No such todo'})
  }

  res.status(200).json(todo)
}

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  deleteTodo,
  updateTodo
}