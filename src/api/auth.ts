 
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const signupAPI = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/signup`, {
    name, email, password
  });
  return response.data;
};

export const signinAPI = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/signin`, {
    email, password
  });
  return response.data;
};