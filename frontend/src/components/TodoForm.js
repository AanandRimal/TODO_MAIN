import { useState, useEffect } from 'react';
import { useTodosContext } from '../hooks/useTodosContext';
import { useAuthContext } from '../hooks/useAuthContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { MenuItem } from '@mui/material';
import Chip from '@mui/material/Chip';
import {
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

const TodoForm = () => {
  const { dispatch } = useTodosContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(''); // Added state for selected priority
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]); // Added state for priorities
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/categories', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchPriorities = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/priorities', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        setPriorities(data);
      } catch (error) {
        console.error('Error fetching priorities:', error);
      }
    };

    fetchCategories();
    fetchPriorities();
  }, [user.token]);

  const handlePriorityClick = (priorityId) => {
    setSelectedPriority(priorityId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in');
      return;
    }

    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    if (!selectedPriority) {
      setError('Please select a priority');
      return;
    }

    const todo = {
      title,
      description,
      date,
      categoryName: selectedCategory,
      priorityId: selectedPriority, // Sending priorityId instead of priority name
    };

    const response = await fetch('http://localhost:4000/api/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      if (json && json.emptyFields) {
        setEmptyFields(json.emptyFields);
      } else {
        setEmptyFields([]);
      }
      setError(json.error || 'An error occurred');
      return;
    }

    setEmptyFields([]);
    setError(null);
    setTitle('');
    setDescription('');
    setDate('');
    setSelectedCategory('');
    setSelectedPriority('');
    dispatch({ type: 'CREATE_TODO', payload: json });
  };

  return (
  <Box
  component="form"
  className="create"
  onSubmit={handleSubmit}
  sx={{
    position: 'fixed',
    top: '50%',
    left: '85%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '24px',
    borderRadius: '4px',
    zIndex: 9999,
    marginBottom: '24px', // Adjust the value as needed
  }}
>

      <Typography variant="h4" gutterBottom sx={{ color: 'rgb(228, 152, 10);' }}>
        <h4>Add a New TODO</h4>
      </Typography>

      <TextField
        label="TODO Title"
        variant="outlined"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={emptyFields.includes('title')}
        helperText={emptyFields.includes('title') ? 'This field is required' : ''}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={emptyFields.includes('description')}
        helperText={emptyFields.includes('description') ? 'This field is required' : ''}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Date"
        variant="outlined"
        type="date"
        fullWidth
        value={date}
        onChange={(e) => setDate(e.target.value)}
        error={emptyFields.includes('date')}
        helperText={emptyFields.includes('date') ? 'This field is required' : ''}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          placeholder: 'dd/mm/yyyy',
        }}
        sx={{ mb: 2 }}
      />

  
<FormControl variant="outlined" fullWidth sx={{ marginBottom: '16px' }}>
        <InputLabel>Select a category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          label="Category"
          MenuProps={{
            style: {
              zIndex: 9999, // Set a higher zIndex for the dropdown menu
            },
          }}
          error={emptyFields.includes('selectedCategory')}
        >
          <MenuItem value="" disabled>
            Select a category
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="body1" sx={{ marginBottom: '8px' }}>
      <strong> Priority:</strong> 
      </Typography>
      <Box sx={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {priorities.map((priority) => (
          <Chip
            key={priority._id}
            label={priority.name}
            color={selectedPriority === priority._id ? 'primary' : 'default'}
            onClick={() => handlePriorityClick(priority._id)}
          />
        ))}
      </Box>

      <Button type="submit" variant="contained" color="secondary" sx={{ color: 'white',margin:'10px' }}>
        Add TODO
      </Button>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

export default TodoForm;
