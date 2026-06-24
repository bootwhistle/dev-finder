import axios from 'axios';
import User from '../types';

const api = axios.create({
  // TODO: replace the baseURL with your own IP address and port number
  // run 'npm run backend' to start json-server, then update to your machine's LAN IP for physical devices
  // Android emulator: http://10.0.2.2:3000 | iOS simulator: http://localhost:3000
  baseURL: 'http://10.0.2.2:3000',
});

export function getUsers() {
  return api.get<User[]>('/users/').then(({ data }) => data);
}

export function getUserByLogin(username: string) {
  return api
    .get<User[]>(`/users/?login=${username}`)
    .then((res) => res.data[0]);
}

export function postUser(user: Omit<User, 'id'>) {
  return api.post<User>('/users/', user).then(({ data }) => data);
}

export function deleteUser(id: number) {
  return api.delete(`/users/${id}`).then(({ data }) => data);
}
