import axios from 'axios';

const token :string|null = localStorage.getItem("token")
export const http = axios.create({
  baseURL: 'http://localhost:3001', // Assurez-vous que cela correspond à l'URL de votre backend
  headers: {
    'Authorization': `Bearer ${token && token}`
  },
});