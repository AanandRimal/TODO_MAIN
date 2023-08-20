const express = require('express');
const {
  getTodos,
  getTodo,
  createTodo,
  deleteTodo,
  updateTodo
} = require('../controllers/TodoController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();
const multer = require('multer');

// require auth for all todo routes
router.use(requireAuth);

// GET all todo
router.get('/', getTodos);

// GET a single todo
router.get('/:id', getTodo);

// DELETE a todo
router.delete('/:id', deleteTodo);

// UPDATE a todo
router.patch('/:id', updateTodo);


//MULTER USE FOR FILE CONVERSION 

//once submitted the form we get the file and make a destination to upload and make a storage and send file to todocontroller for create todo funciton
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination folder for storing the files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for storing
  },
});

// Create a multer upload instance
const upload = multer({ storage: storage });

// Update your createTodo route to use the multer upload middleware
router.post('/', upload.single('file'), createTodo); // before Todocontroller multer is executed and make a file and return req.file to the todocontroller createtotod funciton where we take the file form req.file

module.exports = router;
