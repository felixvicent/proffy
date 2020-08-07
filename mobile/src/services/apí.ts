import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.5.7:3333'
});

export default api;