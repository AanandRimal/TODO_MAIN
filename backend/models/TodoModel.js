const mongoose = require('mongoose');
const Category = require('./CategoryModel');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  priorityId: {
    type: Schema.Types.ObjectId,
    ref: 'Priority',
    default: null
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  file: {
    type: String, // Assuming the file path will be stored as a string
    default: null
  }
}, { timestamps: true });

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;
