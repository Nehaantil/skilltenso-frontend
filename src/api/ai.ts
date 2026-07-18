 
import axios from 'axios';

const API_URL = 'https://skilltenso.onrender.com/api';

export const generateSummaryAPI = async (
  partnerName: string,
  skill: string,
  duration: number,
  messages: number
) => {
  const response = await axios.post(`${API_URL}/ai/summary`, {
    partnerName,
    skill,
    duration,
    messages
  });
  return response.data;
};

export const getMatchSuggestionAPI = async (
  teachSkill: string,
  learnSkill: string
) => {
  const response = await axios.post(`${API_URL}/ai/match-suggestion`, {
    teachSkill,
    learnSkill
  });
  return response.data;
};