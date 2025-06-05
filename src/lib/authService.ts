import type { User } from '@/types';

// Mock database of users
const users: User[] = [
  { id: '1', email: 'user@example.com', name: 'Test Bruker', avatarUrl: 'https://placehold.co/100x100.png' },
];

const MOCK_USER_KEY = 're livery_mock_user';

export async function login(email: string, password?: string): Promise<User | null> {
  // In a real app, you'd validate credentials against a backend.
  // Here, we'll just find a user by email.
  const user = users.find(u => u.email === email);
  if (user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
    }
    return user;
  }
  return null;
}

export async function signup(name: string, email: string, password?: string): Promise<User | null> {
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists with this email.');
  }
  const newUser: User = {
    id: String(users.length + 1),
    email,
    name,
    avatarUrl: `https://placehold.co/100x100.png?text=${name.substring(0,1)}`
  };
  users.push(newUser); // In a real app, save to DB
  if (typeof window !== 'undefined') {
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
  }
  return newUser;
}

export async function logout(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(MOCK_USER_KEY);
  }
}

export function getAuthenticatedUser(): User | null {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(MOCK_USER_KEY);