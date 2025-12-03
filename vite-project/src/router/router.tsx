
import { createBrowserRouter, Navigate } from "react-router-dom";
import { TodoList } from "../Application/Page/TodoList";
import {Login} from "../Application/Page/Login" 



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
]);
