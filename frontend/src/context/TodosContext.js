import { createContext, useReducer } from 'react'

export const TodosContext = createContext()

export const TodosReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TODOS':
      return { 
        Todos: action.payload 
      }
    case 'CREATE_TODO':
      return { 
        Todos: [action.payload, ...state.Todos] 
      }
    case 'DELETE_TODO':
      return { 
        Todos: state.Todos.filter(t => t._id !== action.payload._id) 
      }
    default:
      return state
  }
}

export const TodosContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(TodosReducer, { 
    Todos: null
  })
  
  return (
    <TodosContext.Provider value={{ ...state, dispatch }}>
      { children }
    </TodosContext.Provider>
  )
}