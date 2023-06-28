import React, { useState, useEffect } from "react";
import { useTodosContext } from "../hooks/useTodosContext";
import { useAuthContext } from "../hooks/useAuthContext";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import Typography from "@mui/material/Typography";
// components
import TodoDetails from "../components/TodoDetails";
import TodoForm from "../components/TodoForm";

const Home = () => {
  const { Todos, dispatch } = useTodosContext();
  const { user } = useAuthContext();

  const [activeTab, setActiveTab] = useState("active");
  const [filterDate, setFilterDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("http://localhost:4000/api/todos", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_TODOS", payload: json });
      }
    };

    const fetchCategories = async () => {
      const response = await fetch("http://localhost:4000/api/categories", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        setCategories(json);
      }
    };
    const fetchPriorities = async () => {
      const response = await fetch("http://localhost:4000/api/priorities", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        setPriorities(json);
      }
    };
    

    if (user) {
      
      fetchTodos();
      fetchCategories();
      fetchPriorities();
    }
  }, [dispatch, user]);

  // Filter Todos based on the selected date and activeTab
  const currentDate = new Date().toLocaleDateString();
  const filteredTodos =
    Todos &&
    Todos.filter((todo) => {
      const todoDate = new Date(todo.date).toLocaleDateString();
      const isFutureDate = todoDate >= currentDate;
      return activeTab === "active" ? isFutureDate : !isFutureDate;
    });

  // Sort Todos by date in descending order
  const sortedFilteredTodos =
    filteredTodos &&
    filteredTodos.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Filter completed Todos that have a date in the past
  const completedTodos =
    Todos &&
    Todos.filter((todo) => {
      const todoDate = new Date(todo.date).toLocaleDateString();
      const isPastDate = todoDate < currentDate;
      return isPastDate;
    }).map((todo) => ({ ...todo, isCompleted: true })); // Add isCompleted property to completed todos

  // Sort completed Todos by date in descending order
  const sortedCompletedTodos =
    completedTodos &&
    completedTodos.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Group todos by date
  const groupTodosByDate = (todos) => {
    const groupedTodos = [];
    let currentDate = null;

    todos.forEach((todo) => {
      const todoDate = new Date(todo.date).toLocaleDateString();
      if (todoDate !== currentDate) {
        currentDate = todoDate;
        groupedTodos.push({ date: todoDate, todos: [todo] });
      } else {
        groupedTodos[groupedTodos.length - 1].todos.push(todo);
      }
    });

    return groupedTodos;
  };

  // Filter Todos based on the selected date, category, and priority
  const handleFilterByDateCategoryPriority = () => {
    let filteredTodos = sortedFilteredTodos;

    if (filterDate) {
      filteredTodos = filteredTodos.filter(
        (todo) =>
          new Date(todo.date).toLocaleDateString() ===
          new Date(filterDate).toLocaleDateString()
      );
    }

    if (selectedCategory) {
      filteredTodos = filteredTodos.filter(
        (todo) => todo.categoryId === selectedCategory
      );
    }

    if (selectedPriority) {
      filteredTodos = filteredTodos.filter(
        (todo) => todo.priorityId === selectedPriority
      );
    }
    if (filteredTodos.length > 0) {
      const groupedTodos = groupTodosByDate(filteredTodos);

      return groupedTodos.map((group) => (
        <Box key={group.date} sx={{ marginBottom: 4 }}>
          <Paper
            sx={{
              backgroundColor: "#f8f8f8",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <Typography variant="h6">{group.date}</Typography>
          </Paper>
          {group.todos.map((todo) => (
            <TodoDetails Todo={todo} key={todo._id} isCompleted={false} />
          ))}
        </Box>
      ));
    } else {
      return (
        <p>No todos to display for the selected date, category, and priority.</p>
      );
    }
  };

  return (
    <div className="home">
      <div className="workouts">
        <Tabs value={activeTab} onChange={(e, newTab) => setActiveTab(newTab)}>
          <Tab
            value="active"
            label="Active"
            sx={{ color: "#ffffff", backgroundColor: "rgba(0, 0, 0, 0.87)" }}
          />
          <Tab
            value="completed"
            label="Completed"
            sx={{ color: "#ffffff", backgroundColor: "rgba(0, 0, 0, 0.87)" }}
          />
        </Tabs>
        <TabPanel value={activeTab} index="active">
          <div className="filterdiv">
            <Grid container spacing={2} sx={{ marginTop: 1, marginBottom: 1 }}>
              <Grid item>
                <FormControl>
                  <input
                    type="date"
                    id="filterDate"
                    className="filter"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel
                    htmlFor="filterCategory"
                    sx={{
                      color: 'white', // Set the color of the label to white
                      // Set the background color of the label
                    }}
                  >
                    Filter by Category
                  </InputLabel>
                  <Select
                    label="Select Category"
                    id="filterCategory"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    sx={{
                      '& .MuiSelect-select': {
                        color: 'white' // Set the color of the selected option
                      },
                      '& .MuiInput-underline:before': {
                        borderBottomColor: 'white' // Set the color of the underline
                      }
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {categories.map((category) => (
                      <MenuItem value={category._id} key={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel
                    htmlFor="filterPriority"
                    sx={{
                      color: 'white', // Set the color of the label to white
                      // Set the background color of the label
                    }}
                  >
                    Filter by Priority
                  </InputLabel>
                  <Select
                    label="Select Priority"
                    id="filterPriority"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    sx={{
                      '& .MuiSelect-select': {
                        color: 'white' // Set the color of the selected option
                      },
                      '& .MuiInput-underline:before': {
                        borderBottomColor: 'white' // Set the color of the underline
                      }
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {priorities.map((priority) => (
                      <MenuItem value={priority._id} key={priority._id}>
                        {priority.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>

          {filterDate || selectedCategory || selectedPriority ? (
            handleFilterByDateCategoryPriority()
          ) : (
            <>
              {sortedFilteredTodos && sortedFilteredTodos.length > 0 ? (
                <Box>
                  {groupTodosByDate(sortedFilteredTodos).map((group) => (
                    <Box key={group.date} sx={{ marginBottom: 4 }}>
                      <Paper
                        sx={{
                          backgroundColor: "#f8f8f8",
                          padding: "12px",
                          marginBottom: "12px",
                        }}
                      >
                        <Typography variant="h6">{group.date}</Typography>
                      </Paper>
                      {group.todos.map((todo) => (
                        <TodoDetails
                          Todo={todo}
                          key={todo._id}
                          isCompleted={false}
                        />
                      ))}
                    </Box>
                  ))}
                </Box>
              ) : (
                <p>No todos to display.</p>
              )}
            </>
          )}
        </TabPanel>
        <TabPanel value={activeTab} index="completed">
          {sortedCompletedTodos && sortedCompletedTodos.length > 0 ? (
            <Box>
              {groupTodosByDate(sortedCompletedTodos).map((group) => (
                <Box key={group.date} sx={{ marginBottom: 4 }}>
                  <Paper
                    sx={{
                      backgroundColor: "#f8f8f8",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <Typography variant="h6">{group.date}</Typography>
                  </Paper>
                  {group.todos.map((todo) => (
                    <TodoDetails
                      Todo={todo}
                      key={todo._id}
                      isCompleted={true}
                    />
                  ))}
                </Box>
              ))}
            </Box>
          ) : (
            <p>No completed todos to display.</p>
          )}
        </TabPanel>
      </div>
      <TodoForm />
    </div>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export default Home;