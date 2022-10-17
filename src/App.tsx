import { ChangeEvent, FormEvent, useEffect, useState } from "react"

function App() {

  const [todos, setTodos] = useState<any[]>([])
  const [selectedTodo, setSelectedTodo] = useState<string | null>(null)
  const [todoInput, setTodoInput] = useState<any>({
    title: '',
    description: '',
    priority: 'high'
  })


  const refetch = () => {
    fetch('http://localhost:2000/todo')
    .then((res)=> res.json())
    .then((data)=>setTodos(data))
  }
 
  useEffect(refetch, [])


  const toggleCompletedTodo = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    fetch(`http://localhost:2000/todo/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({completed: e.target.checked})
    }).then(refetch)
  }

  

  const createTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string

    fetch('http://localhost:2000/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title, description, priority})
    }).then(refetch)

    setTodoInput({
      title: '',
      description: '',
      priority: 'high'
    })

  }

  const deleteTodo = (id: string) => {
    fetch(`http://localhost:2000/todo/${id}`, {
      method: 'DELETE'
    }).then(refetch)
  }

  const selectTodo = (todo: any) => {
    window.scrollTo({top: 0})
    setSelectedTodo(todo.id)
    setTodoInput({
      title: todo.title,
      description: todo.description,
      priority: todo.priority
    })

    
  }

  const editTodo = (e: FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    
    const formData = new FormData(form)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string

    fetch(`http://localhost:2000/todo/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title, description, priority})
    }).then(refetch)

    setSelectedTodo(null)
    setTodoInput({
      title: '',
      description: '',
      priority: 'high'
    })
    
  }

  const setPriority = (priority: string) => {
    switch(priority) {
      case 'high':
        return 'text-danger'
      case 'medium':
        return 'text-warning'
      case 'low':
        return 'text-success'
      default:
        return 'text-body'
    }
  }

  const changeInputAndSelect = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target
    setTodoInput((prev: any) => ({...prev, [name]: value}))
  }

  const cancel = () => {
    setSelectedTodo(null)
    setTodoInput({
      title: '',
      description: '',
      priority: 'high'
    })
  }


  return (
    <div className="App text-light">
      <form className="m-5" onSubmit={(e)=> selectedTodo ? editTodo(e, selectedTodo) : createTodo(e)}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" value={todoInput.title} onChange={(e)=>changeInputAndSelect(e)} className="form-control" required />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="description">Description</label>
          <input type="text" name="description" id="description" onChange={(e)=>changeInputAndSelect(e)} value={todoInput.description} className="form-control" />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="priority">Priority</label>
          <select name="priority"  onChange={(e)=> changeInputAndSelect(e)} id="priority" className="form-control">
            <option selected={todoInput.priority === "high"} value="high">High</option>
            <option selected={todoInput.priority === "medium"} value="medium">Medium</option>
            <option selected={todoInput.priority === "low"} value="low">Low</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">{selectedTodo ? "Edit": "Create"}</button>
        {selectedTodo && <button type="button" onClick={cancel} className="btn btn-danger mt-3 ms-3">Cancel</button>}
      </form>
     {todos.map(todo => (
        <div className="m-5 border rounded p-5 d-flex justify-content-between" key={todo.id}>
          <div>
            <h2>{todo.title}</h2>
            <p>{todo.description}</p>
            <p>Priority: <span className={setPriority(todo.priority)}>{todo.priority}</span></p>
            <p>Creation Date: {(new Date(todo.createdAt)).toLocaleString()}</p>
          </div>
          <div className="d-flex align-items-baseline gap-2">
            <input type="checkbox" className="" checked={todo.completed}  onChange={(e)=>toggleCompletedTodo(e, todo.id)} id={`${todo.id}-checkbox`}/>
            <button className="btn btn-success" onClick={() => selectTodo(todo)}>Edit</button>
            <button className="btn btn-danger" onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        </div>
     ))}
    </div>
  )
}

export default App
