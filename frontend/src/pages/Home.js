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
import enLabels from "../languages/en";
import neLabels from "../languages/ne";
import { useLanguageContext } from "../hooks/useLanguageContext";
const Home = () => {
  const { Todos, dispatch } = useTodosContext();
  const { user } = useAuthContext();
    const { locale, labels, handleLanguageToggle } = useLanguageContext();
  const [activeTab, setActiveTab] = useState("active");
  const [filterDate, setFilterDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [sortOption, setSortOption] = useState("highestDate");
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
  const assignedTodos = Todos && Todos.filter((todo) => todo.assignee === user.user_id);
  const unassignedTodos = Todos && Todos.filter((todo) => todo.assignee !== user.user_id);

  const currentDate = new Date();
  const filteredTodos =
  assignedTodos &&
  assignedTodos.filter((todo) => {
    const todoDate = new Date(todo.date);
    const isFutureDate = todoDate >= currentDate; // Compare with the current date
    return activeTab === "active" ? isFutureDate : !isFutureDate;
  });


  // Sort Todos by date in ascending or descending order based on the sorting option
const sortedFilteredTodos =
filteredTodos &&
filteredTodos.sort((a, b) => {
  if (sortOption === "lowestDate") {
    return new Date(a.date) - new Date(b.date);
  } else {
    return new Date(b.date) - new Date(a.date);
  }
});

  // Filter completed Todos that have a date in the past
  const completedTodos =
    assignedTodos &&
   assignedTodos.filter((todo) => {
    const todoDate = new Date(todo.date);
      const isPastDate = todoDate <  new Date();
      return isPastDate;
    }).map((todo) => ({ ...todo, isCompleted: true })); // Add isCompleted property to completed todos

    const sortedCompletedTodos =
    completedTodos &&
    completedTodos.sort((a, b) => {
      if (sortOption === "lowestDate") {
        return new Date(a.date) - new Date(b.date);
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });

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
              backgroundColor: "#000000",
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
        <p style={{color:'white'}}>{labels.soryynotavailabelmsg}</p>
      );
    }
  };

  return (
    <div className="home">
  <div className="toggle-container">
    <Tabs
      value={activeTab}
      onChange={(e, newTab) => setActiveTab(newTab)}
      sx={{ marginRight: "auto" }} // Align tabs to the left
    >
      <Tab
        value="active"
        label={labels.activeTab}
        sx={{
          color: "#ffffff",
          backgroundColor: "rgba(0, 0, 0, 0.87)",
        }}
      />
      <Tab
        value="completed"
        label={labels.completedTab}
        sx={{
          color: "#ffffff",
          backgroundColor: "rgba(0, 0, 0, 0.87)",
        }}
      />
      <Tab
        value="assigned"
        label={labels.assignedTab}
        sx={{
          color: "#ffffff",
          backgroundColor: "rgba(0, 0, 0, 0.87)",
        }}
      />
    </Tabs>
    {/* <div className="toggle-buttons">
      <button onClick={() => handleLanguageToggle('en')}>English</button>
      <button onClick={() => handleLanguageToggle('ne')}>नेपाली</button>
    </div> */}
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
                 {labels.filterByCategory}
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
                  {labels.filterByPriority}
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
                    <MenuItem value="">{labels.ALL}</MenuItem>  //cant use labels.instead i cna do [] 
                    {priorities.map((priority) => (
                      <MenuItem value={priority._id} key={priority._id}>
                        {labels[priority.name]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
  <FormControl sx={{ minWidth: 200 }}>
    <InputLabel
      htmlFor="sortOption"
      sx={{
        color: 'white',
      }}
    >
     {labels.sortoption}
    </InputLabel>
    <Select
      label="Sort Option"
      id="sortOption"
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
      sx={{
        '& .MuiSelect-select': {
          color: 'white'
        },
        '& .MuiInput-underline:before': {
          borderBottomColor: 'white'
        }
      }}
    >
      <MenuItem value="highestDate">{labels.descendingdate}</MenuItem>
      <MenuItem value="lowestDate">{labels.ascendingdate}</MenuItem>
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
                          backgroundColor: "#000000",
                          padding: "12px",
                          marginBottom: "12px",
                          marginTop:"7px",
                          color:"white"
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
                <p style={{color:'white'}}>{labels.sorrynotavailablemsg}.</p>
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
                      backgroundColor: "#000000",
                      padding: "12px",
                      marginBottom: "12px",
                      marginTop:"7px",
                      color:"white"
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
            <p style={{color:'white'}}>{labels.sorrynotavailablemsg}</p>
          )}
        </TabPanel>
        <TabPanel value={activeTab} index="assigned">
          {unassignedTodos && unassignedTodos.length > 0 ? (
            <Box>
              {groupTodosByDate(unassignedTodos).map((group) => (
                <Box key={group.date} sx={{ marginBottom: 4 }}>
                  <Paper
                    sx={{
                      backgroundColor: "#000000",
                      padding: "12px",
                      marginBottom: "12px",
                      marginTop:"10px",
                      color:"white"
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
            <p style={{color:'white'}}>No assigned todos to display.</p>
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

export default Home