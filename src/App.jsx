import { useEffect, useState, useRef} from 'react'
import './App.css'

const STORAGE_KEY = "Personal-task-tracker-tasks"

function App() {
  const [taskText, setTaskText] = useState("")
  const [editingTaskId, setEditingTaskId] = useState(null)
  const taskInputRef = useRef(null)

  const [tasks, setTasks] = useState(()=>{
    try{
        const savedTasks = localStorage.getItem(STORAGE_KEY)
        const parsedTasks = savedTasks ? JSON.parse(savedTasks):[] 

        return Array.isArray(parsedTasks) ? parsedTasks : []
    } catch(error){
      console.error("Could not load saved tasks", error)
      return []
    }
  })

useEffect(()=>{
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))

  }catch(error){
    console.error("Could not save task", error)
  }
}, [tasks])
  function handleSubmit(event){
    event.preventDefault()

    const text = taskText.trim()

    if(text === ""){
      return 
    }

    if(editingTaskId !== null){
      setTasks((currentTasks)=>currentTasks.map((task)=>task.id === editingTaskId ? {...task, text:text} : task))

      cancelEditing()
      return
    }


    const newTask = {
      id: crypto.randomUUID(),
      text: text,
      complete: false
    }

    setTasks((currentTasks)=>[...currentTasks, newTask])
    setTaskText("")
  }

      function toggleTask(taskId){
      setTasks((currentTasks)=>currentTasks.map(
        (task)=>task.id == taskId ? {...task, complete:!task.complete}
        :task
      ))
    }

  function deleteTask(taskId){
    setTasks((currentTasks)=>currentTasks.filter((task)=>task.id !== taskId))

    if (editingTaskId === taskId) {
      cancelEditing()
    }
  }
  
  function startEditing(task){
    setEditingTaskId(task.id)
    setTaskText(task.text)
    taskInputRef.current?.focus()
  }

  function cancelEditing(){
    setEditingTaskId(null)
    setTaskText("")
  }

  return (
    <main className='task-app'>
      <h1>Personal Task Tracker</h1>
      <p>What task would you like to do today?</p>

      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="task-input">{editingTaskId === null ? 'New Task' : 'Edit Task'}</label>
        <input type="text" ref={taskInputRef} id='task-input' placeholder='eg. Practice react' value={taskText} onChange={(event)=>setTaskText(event.target.value)} required/>
        <button type="submit">{editingTaskId === null ? 'Add Task' : 'Save Changes'}</button>
        {editingTaskId !== null && (
        <button type="button" onClick={cancelEditing}>
          Cancel
        </button>
      )}
  </form>
    {
      tasks.length === 0 ?(
        <p>No tasks to display yet.</p>
      ):(
        <ul>
        {tasks.map((task)=>(
          <li key={task.id}>
            <label >
              <input  type="checkbox" checked={task.complete} onChange={()=>toggleTask(task.id)}/>
              <span                 style={{ 
                  textDecoration:task.complete ? "line-through" : "none"
                }}>
                {task.text}
              </span>
            
            </label>
            <button type="button" onClick={() => startEditing(task)}>
              Edit
            </button>
            <button type="button" onClick={()=>deleteTask(task.id)} arial-label={`Delete task ${task.text}`}>Delete</button>
          </li>
        ))}
        </ul>
      )
    }
    </main>
  )
}

export default App
