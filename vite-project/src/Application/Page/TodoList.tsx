import { useEffect, useState } from "react"
import TodoItem from "./TodoItem"
import { Construction } from "lucide-react"
import { NavBar } from "../../Components/Navbar"
import { http } from "../../Http/Axios.Instance"

type Priority = "Basse" | "Moyenne" | "Urgente"

type Todo = {
  _id: string
  title: string
  description?: string
  priority: Priority
}

export const TodoList: React.FC = () => {
  const [input, setInput] = useState("")
  const [priority, setPriority] = useState<Priority>("Moyenne")
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<Priority | "Tous">("Tous")
  const [selectedTodos, setSelectedTodos] = useState<Set<string>>(new Set())

  const userId = localStorage.getItem("userId")

  /* ------------------------------
     LOAD TASKS (RECONNEXION)
  -------------------------------- */
useEffect(() => {
  if (!userId) return

  const fetchTasks = async () => {
    try {
      const res = await http.get(`/tasks/user/${userId}`)

      const tasks = Array.isArray(res.data)
        ? res.data
        : res.data.tasks || []

      setTodos(tasks)
    } catch (err) {
      console.error("Erreur chargement tasks", err)
      setTodos([]) // sécurité
    }
  }

  fetchTasks()
}, [userId])

  /* ------------------------------
     ADD TASK
  -------------------------------- */
  const addTodo = async () => {
    if (!input.trim() || !userId) return

    try {
      const res = await http.post("/tasks", {
        user_id: userId,
        title: input.trim(),
        priority,
        description: "",
      })

      setTodos((prev) => [res.data, ...prev])
      setInput("")
      setPriority("Moyenne")
    } catch (err) {
      console.error("Erreur ajout task", err)
    }
  }

  /* ------------------------------
     DELETE ONE TASK
  -------------------------------- */
  const deleteTodo = async (id: string) => {
    try {
      await http.delete(`/tasks/${id}`)
      setTodos((prev) => prev.filter((t) => t._id !== id))
    } catch (err) {
      console.error("Erreur suppression task", err)
    }
  }

  /* ------------------------------
     SELECT / MULTI DELETE
  -------------------------------- */
  const toggleSelectTodo = (id: string) => {
    const newSelected = new Set(selectedTodos)
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id)
    setSelectedTodos(newSelected)
  }

  const finishSelected = async () => {
    try {
      const ids = Array.from(selectedTodos)

      await http.delete("/tasks", {
        params: { id: ids },
      })

      setTodos((prev) => prev.filter((t) => !selectedTodos.has(t._id)))
      setSelectedTodos(new Set())
    } catch (err) {
      console.error("Erreur suppression multiple", err)
    }
  }

  /* ------------------------------
     FILTERS
  -------------------------------- */
  const filteredTodos =
    filter === "Tous"
      ? todos
      : todos.filter((todo) => todo.priority === filter)

  const urgentCount = todos.filter((t) => t.priority === "Urgente").length
  const mediumCount = todos.filter((t) => t.priority === "Moyenne").length
  const lowCount = todos.filter((t) => t.priority === "Basse").length
  const totalCount = todos.length

  return (
    <div className="flex justify-center">
      <NavBar />

      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">
        {/* ADD TASK */}
        <div className="flex gap-4">
          <input
            type="text"
            className="input w-full"
            placeholder="Ajouter une tâche..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <select
            className="select w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>

          <button onClick={addTodo} className="btn btn-primary">
            Ajouter
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <button
              className={`btn btn-soft ${filter === "Tous" ? "btn-primary" : ""}`}
              onClick={() => setFilter("Tous")}
            >
              Tous ({totalCount})
            </button>

            <button
              className={`btn btn-soft ${
                filter === "Urgente" ? "btn-primary" : ""
              }`}
              onClick={() => setFilter("Urgente")}
            >
              Urgente ({urgentCount})
            </button>

            <button
              className={`btn btn-soft ${
                filter === "Moyenne" ? "btn-primary" : ""
              }`}
              onClick={() => setFilter("Moyenne")}
            >
              Moyenne ({mediumCount})
            </button>

            <button
              className={`btn btn-soft ${
                filter === "Basse" ? "btn-primary" : ""
              }`}
              onClick={() => setFilter("Basse")}
            >
              Basse ({lowCount})
            </button>
          </div>

          <button
            className="btn btn-primary"
            onClick={finishSelected}
            disabled={selectedTodos.size === 0}
          >
            Finir la sélection ({selectedTodos.size})
          </button>
        </div>

        {/* LIST */}
        {filteredTodos.length > 0 ? (
          <ul className="divide-y divide-primary/20">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                isSelected={selectedTodos.has(todo._id)}
                onDelete={() => deleteTodo(todo._id)}
                onToggleSelect={toggleSelectTodo}
              />
            ))}
          </ul>
        ) : (
          <div className="flex justify-center items-center flex-col p-5">
            <Construction className="w-40 h-40 text-primary" />
            <p className="text-sm">Aucune tâche pour ce filtre</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TodoList
