import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios"

axios.defaults.baseURL = "localhost:8000/api/v1/auth/"
axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token")

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
