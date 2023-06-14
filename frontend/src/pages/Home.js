import { useEffect } from "react"
import { useTodosContext } from "../hooks/useTodosContext"

// components
import TodoDetails from "../components/TodoDetails"
import TodoForm from "../components/TodoForm"

const Home = () => {
  const { Todos, dispatch } = useTodosContext()

  useEffect(() => {
    const fetchTodos = async () => {

      const response = await fetch('http://localhost:4000/api/todos')
      const json = await response.json()
      if (response.ok) {
        dispatch({type: 'SET_TODOS', payload: json})
      }
    }

    fetchTodos()
  }, [dispatch])

  return (
    <div className="home">
      <div className="workouts">
        {Todos && Todos.map(Todo => (
          <TodoDetails Todo={Todo} key={Todo._id} />
        ))}
      </div>
      <TodoForm />
    </div>
  )
}

export default Home