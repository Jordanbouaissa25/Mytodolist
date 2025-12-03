
import { createBrowserRouter, Navigate } from "react-router-dom";
import { TodoList } from "../Application/Page/TodoList";
import { Login} from "../Application/Page/Login" 
import { Register } from "../Application/Page/Register";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <TodoList />,
    index: true
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Register",
    element: <Register />,
  }
]);
