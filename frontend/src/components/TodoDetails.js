import { useTodosContext } from '../hooks/useTodosContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const TodoDetails = ({ Todo }) => {
  const { dispatch } = useTodosContext()

  const handleClick = async () => {
    const response = await fetch('http://localhost:4000/api/todos/' + Todo._id, {
      method: 'DELETE'
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_TODO', payload: json})
    }
  }

  return (
    <div className="workout-details">
      <h4>{Todo.title}</h4>
      <p><strong>Description : </strong>{Todo.description}</p>
      <p>{formatDistanceToNow(new Date(Todo.createdAt), { addSuffix: true })}</p>
      <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
    </div>
  )
}

export default TodoDetails