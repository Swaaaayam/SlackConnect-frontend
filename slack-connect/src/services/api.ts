import axios from 'axios';
const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export const installUrl = `${BASE}/auth/install`;

export async function fetchChannels(team_id: string) {
  return axios.get(`${BASE}/api/channels?team_id=${team_id}`).then(r=>r.data);
}
export async function sendNow(team_id:string, channel:string, text:string){
  return axios.post(`${BASE}/api/message/send`, {team_id, channel, text}).then(r=>r.data);
}
export async function schedule(team_id:string, channel:string, text:string, post_at:string){
  return axios.post(`${BASE}/api/message/schedule`, {team_id, channel, text, post_at}).then(r=>r.data);
}
export async function listScheduled(team_id:string){
  return axios.get(`${BASE}/api/message/scheduled?team_id=${team_id}`).then(r=>r.data);
}
export async function cancelScheduled(id:string){
  return axios.delete(`${BASE}/api/message/scheduled/${id}`).then(r=>r.data);
}
