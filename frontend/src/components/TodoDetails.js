// import { useTodosContext } from '../hooks/useTodosContext';
// import { useState, useEffect } from 'react';
// import formatDistanceToNow from 'date-fns/formatDistanceToNow';
// import { useAuthContext } from '../hooks/useAuthContext';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Grid from '@mui/material/Grid';
// import Stack from '@mui/material/Stack';

// const TodoDetails = ({ Todo }) => {
//   const { dispatch } = useTodosContext();
//   const [isEditing, setIsEditing] = useState(false);
//   const [updatedTodo, setUpdatedTodo] = useState({
//     title: Todo.title,
//     description: Todo.description,
//     date: Todo.date,
//   });
//   const { user } = useAuthContext();

//   useEffect(() => {
//     setUpdatedTodo({
//       title: Todo.title,
//       description: Todo.description,
//       date: Todo.date,
//     });
//   }, [Todo]);

//   if (!user) {
//     return null;
//   }

//   const handleDelete = async () => {
//     if (!user) {
//       return;
//     }

//     const response = await fetch(`http://localhost:4000/api/todos/${Todo._id}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${user.token}`,
//       },
//     });
//     const json = await response.json();

//     if (response.ok) {
//       dispatch({ type: 'DELETE_TODO', payload: json });
//     }
//   };

//   const handleOpenEdit = () => {
//     if (!user) {
//       return;
//     }
//     setIsEditing(true);
//   };

//   const handleUpdate = async () => {
//     if (!user) {
//       return;
//     }

//     const response = await fetch(`http://localhost:4000/api/todos/${Todo._id}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${user.token}`,
//       },
//       body: JSON.stringify(updatedTodo),
//     });
//     const json = await response.json();

//     if (response.ok) {
//       const updatedPayload = { ...json, _id: Todo._id }; // Include the matching todo ID in the updated payload
//       dispatch({ type: 'UPDATE_TODO', payload: updatedPayload });
//       setIsEditing(false); // Disable editing mode after successful update
//       window.location.reload(); // Reload the page
//     }
//   };

//   const handleInputChange = (event) => {
//     if (!user) {
//       return;
//     }
//     const { name, value } = event.target;
//     setUpdatedTodo((prevTodo) => ({
//       ...prevTodo,
//       [name]: value,
//     }));
//   };

//   const formattedDate = new Date(Todo.date).toLocaleDateString();
//   const currentDate = new Date();

//   // Check if the todo is active or completed based on the date
//   const isActiveTodo = currentDate < new Date(Todo.date);

//   return (
//     <>
//       {isActiveTodo && ( // Render only if the todo is active
//         <Box
//           sx={{
//             marginBottom: 4,
//             backgroundColor: 'rgba(255, 255, 255, 0.8)',
//             boxShadow: '10px 10px 10px 10px rgb(90, 90, 90)',
//             padding: '16px',
//             borderRadius: '4px',
//             transition: 'box-shadow 0.3s ease-in-out',
//             '&:hover': {
//               boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
//               cursor: 'pointer',
//             },
//           }}
//         >
//           <Typography variant="h6" gutterBottom sx={{ color: 'rgb(228, 152, 10)' }}>
//             <h4>{Todo.title}</h4>
//           </Typography>
//           <Typography variant="body1" gutterBottom sx={{ color: 'black' }}>
//             <strong>Description: </strong>
//             {Todo.description}
//           </Typography>

//           <Typography variant="body1" gutterBottom sx={{ color: 'black' }}>
//             <strong>Date: </strong>
//             {formattedDate}
//           </Typography>

//           <Typography variant="body2" gutterBottom sx={{ color: 'black' }}>
//             {formatDistanceToNow(new Date(Todo.createdAt), { addSuffix: true })}
//           </Typography>

//           <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }}>
//             <IconButton aria-label="Delete" onClick={handleDelete}>
//               <DeleteIcon />
//             </IconButton>
//             {!isEditing && (
//               <IconButton aria-label="Edit" onClick={handleOpenEdit}>
//                 <EditIcon />
//               </IconButton>
//             )}
//           </Stack>

//           {isEditing && (
//             <Box sx={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
//               <form onSubmit={handleUpdate}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12}>
//                     <TextField
//                       name="title"
//                       label="Title"
//                       fullWidth
//                       value={updatedTodo.title}
//                       onChange={handleInputChange}
//                       sx={{ backgroundColor: 'white' }}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       name="description"
//                       label="Description"
//                       fullWidth
//                       value={updatedTodo.description}
//                       onChange={handleInputChange}
//                       sx={{ backgroundColor: 'white' }}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       name="date"
//                       label="Date"
//                       type="date"
//                       fullWidth
//                       value={updatedTodo.date}
//                       onChange={handleInputChange}
//                       InputLabelProps={{
//                         shrink: true,
//                       }}
//                       sx={{ backgroundColor: 'white' }}
//                     />
//                   </Grid>
//                 </Grid>

//                 <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
//                   Submit
//                 </Button>
//               </form>
//             </Box>
//           )}
//         </Box>
//       )}
//     </>
//   );
// };

// export default TodoDetails;
import { useTodosContext } from '../hooks/useTodosContext';
import { useState, useEffect } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useAuthContext } from '../hooks/useAuthContext';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import DownloadIcon from '@mui/icons-material/Download';
import { useLanguageContext } from "../hooks/useLanguageContext";

const TodoDetails = ({ Todo, isCompleted }) => {
  const { dispatch } = useTodosContext();
  const [isEditing, setIsEditing] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [priorityName, setPriorityName] = useState('');
  const [priorities, setPriorities] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('');

  const [updatedTodo, setUpdatedTodo] = useState({
    title: Todo.title,
    description: Todo.description,
    date: Todo.date,
    category: Todo.categoryName,
    priority: Todo.priorityId,
    file:Todo.file
  });
  const { user } = useAuthContext();
  const { locale, labels, handleLanguageToggle } = useLanguageContext();
  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/categories/${Todo.categoryId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();

        if (response.ok) {
          setCategoryName(json.name);
        } else {
          setCategoryName('Unknown Category');
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        setCategoryName('Unknown Category');
      }
    };

    const fetchPriorityName = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/priorities/${Todo.priorityId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();

        if (response.ok) {
          setPriorityName(json.name);
        } else {
          setPriorityName('Unknown Priority');
        }
      } catch (error) {
        console.error('Error fetching priority:', error);
        setPriorityName('Unknown Priority');
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

    fetchPriorities();
    fetchCategoryName();
    fetchPriorityName();
  }, [Todo.categoryId, Todo.priorityId, user.token]);

  useEffect(() => {
    setUpdatedTodo({
      title: Todo.title,
      description: Todo.description,
      date: Todo.date,
      category: Todo.categoryName,
      priorityId: Todo.priorityId,
      file:Todo.file,
    });
  }, [Todo]);

  const handlePriorityClick = (priorityI) => {
    setSelectedPriority(priorityI);
    setUpdatedTodo((prevTodo) => ({
      ...prevTodo,
      priorityId: priorityI,
    }));
  };

  if (!user) {
    return null;
  }

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(`http://localhost:4000/api/todos/${Todo._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_TODO', payload: json });
    }
  };

  const handleOpenEdit = () => {
    if (!user) {
      return;
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(`http://localhost:4000/api/todos/${Todo._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(updatedTodo),
    });
    const json = await response.json();

    if (response.ok) {
      const updatedPayload = { ...json, _id: Todo._id }; // Include the matching todo ID in the updated payload
      dispatch({ type: 'UPDATE_TODO', payload: updatedPayload });
      setIsEditing(false); // Disable editing mode after successful update
    }
  };

  const handleInputChange = (event) => {
    if (!user) {
      return;
    }
    const { name, value } = event.target;
    setUpdatedTodo((prevTodo) => ({
      ...prevTodo,
      [name]: value,
    }));
  };

  const formattedDate = new Date(Todo.date).toLocaleDateString();

  const timeRemaining = !isCompleted ? formatDistanceToNow(new Date(Todo.date), { addSuffix: true }) : null;
  //FILE DOWNLOAD
  const handleDownload = async () => {  //When user click in donwload button it call the api download we passed the file path as a query parameter we can also send as body: 
    try {
      const response = await fetch(`http://localhost:4000/api/file/download?filePath=${Todo.file}`);
      //blob is used to represent the binary data as we will be getting binary data so we are using blob object 
      const fileBlob = await response.blob();

 // Extract the original file name from the file path
 const originalFileName = Todo.file.split('/').pop();
  
      // Extract the file extension from the file path
      const fileExtension = Todo.file.split('.').pop();
  
      // Create a temporary URL for the file blob
      const fileURL = URL.createObjectURL(fileBlob); 
  
      // Create a link element and click it to trigger the file download
      const link = document.createElement('a'); // this is ancor tag made
      link.href = fileURL;
      link.download = `${originalFileName}.${fileExtension}`; // Set the dynamic file name and extension
      link.click();
  
      // Clean up the temporary URL
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  
  

  return (

    <Box
      sx={{
        marginBottom: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '10px 10px 10px 10px rgb(90, 90, 90)',
        padding: '16px',
        borderRadius: '4px',
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
        },
      }}
    >


<Typography variant="h4" align="center" gutterBottom sx={{ color: 'rgb(228, 152, 10)' }}>
 <strong>{Todo.title}</strong>
</Typography>
<Typography variant="body1" gutterBottom sx={{ color: 'black', fontWeight: 'bold', marginBottom: '25px' }}>
 {Todo.description}
</Typography>
      <Stack direction="row" spacing={1} sx={{ color: 'black', marginBottom: '10px', '& > .MuiChip-root:hover': { cursor: 'pointer', transform: 'scale(1.08)' } }}>
  {/* <strong>{labels.category}</strong> */}
  <Chip label={categoryName} variant="outlined" color="primary" />
</Stack>

<Stack direction="row" spacing={1} sx={{ color: 'black', marginBottom: '10px', '& > .MuiChip-root:hover': { cursor: 'pointer', transform: 'scale(1.08)' } }}>
  {/* <strong>{labels.priority}</strong> */}
  <Chip
    label={priorityName}
    variant="outlined"
    color={priorityName === 'High' ? 'error' : priorityName === 'Medium' ? 'warning' : 'success'}
  />
</Stack>
      {isCompleted && (
      <Typography variant="body2" gutterBottom sx={{ color: 'red' ,marginBottom:'10px'}}>
        <strong>{labels.todoexpired} </strong>
        </Typography>

)}
     

      {!isCompleted && (
        <Box>
               <Typography variant="body2" gutterBottom sx={{ color: 'red',marginBottom:'10px' }}>
        <strong>{labels.todoexpire} </strong>
        {timeRemaining}
      </Typography>
     <Typography><strong>{labels.file}</strong>
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={handleDownload}
        sx={{
          marginTop: '3px',
          marginBottom:'10px'
        }}
      >
        {labels.download}
      </Button>
      </Typography> 
        <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }}>
      
          <IconButton aria-label="Delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
          {!isEditing ? (
            <IconButton aria-label="Edit" onClick={handleOpenEdit}>
              <EditIcon />
            </IconButton>
          ) : (
            <IconButton aria-label="Cancel" onClick={handleCancelEdit}>
              <ArrowBackIcon />
            </IconButton>
          )}
        </Stack>
        </Box>
      )}

      {isEditing && (
        <Box sx={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          <form onSubmit={handleUpdate}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Title"
                  fullWidth
                  value={updatedTodo.title}
                  onChange={handleInputChange}
                  sx={{ backgroundColor: 'white' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  value={updatedTodo.description}
                  onChange={handleInputChange}
                  sx={{ backgroundColor: 'white' }}
                />
              </Grid>
              <Grid item xs={12}>
  <TextField
    name="date"
    label="Date"
    type="date"
    fullWidth
    value={new Date(updatedTodo.date).toISOString().slice(0, 10)}
    onChange={handleInputChange}
    InputLabelProps={{
      shrink: true,
    }}
    sx={{ backgroundColor: 'white' }}
  />
</Grid>
<Grid item xs={12}>
               
              <Typography variant="body1" sx={{ marginBottom: '8px' }}>
        {labels.priority}
      </Typography>
      <Box sx={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      {priorities.map((priority) => (
  <Chip
    key={priority._id}
    label={priority.name}
    color={selectedPriority === priority._id ? 'secondary' : 'default'}
    onClick={() => handlePriorityClick(priority._id)}
  />
))}

      </Box>
      </Grid>
            </Grid>

            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
              {labels.submit}
            </Button>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default TodoDetails;
