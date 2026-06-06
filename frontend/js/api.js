const API_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('dineflow_token');
}

function authHeader() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getToken()
  };
}