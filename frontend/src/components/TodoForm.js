import { useState } from 'react'
import { useTodosContext } from '../hooks/useTodosContext'

const TodoForm = () => {
  const { dispatch } = useTodosContext()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const Todo = {title, description}
    
    const response = await fetch('http://localhost:4000/api/todos', {
      method: 'POST',
      body: JSON.stringify(Todo),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }
    if (response.ok) {
      setEmptyFields([])
      setError(null)
      setTitle('')
      setDescription('')
      dispatch({type: 'CREATE_TODO', payload: json})
    }

  }

  return (
    <form className="create" onSubmit={handleSubmit}> 
      <h3>Add a New TODO</h3>


      <label>TODO Title:</label>
      <input 
        type="text" 
        onChange={(e) => setTitle(e.target.value)} 
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label>Description:</label>
      <input 
        type="text" 
        onChange={(e) => setDescription(e.target.value)} 
        value={description}
        className={emptyFields.includes('description') ? 'error' : ''}
      />

      <button>Add TODO</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default TodoForm