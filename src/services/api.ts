import { API_BASE_URL } from '../config';
import User from '../types';

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE_URL}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function registerUser(user: Omit<User, 'id'>): Promise<User> {
  // Avoid duplicates — update location if user already registered
  const checkRes = await fetch(`${API_BASE_URL}/users?login=${user.login}`);
  const existing: User[] = await checkRes.json();

  if (existing.length > 0) {
    const patchRes = await fetch(`${API_BASE_URL}/users/${existing[0].id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coordinates: user.coordinates }),
    });
    return patchRes.json();
  }

  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to register user');
  return res.json();
}

export async function removeUser(id: number): Promise<void> {
  await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
}
