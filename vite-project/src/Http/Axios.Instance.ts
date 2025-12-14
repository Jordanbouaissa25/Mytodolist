// import axios from 'axios';

// const token :string|null = localStorage.getItem("token")
// export const http = axios.create({
//   baseURL: 'http://localhost:3001', // Assurez-vous que cela correspond à l'URL de votre backend
//   headers: {
//     'Authorization': `Bearer ${token && token}`
//   },
// });

import axios from "axios"

export const http = axios.create({
  baseURL: "http://localhost:3001",
})

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)
