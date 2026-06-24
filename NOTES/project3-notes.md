# Project 3 Notes

## What changed from P2

- Added `expo-location` for GPS sensor access
- Added `json-server` (dev) as the backend during development
- `src/services/api.ts` — three functions: fetchUsers, registerUser, removeUser
- `src/config.ts` — single place to set the backend URL
- `UserContext` now gets GPS coordinates, hits GitHub API, then registers user in backend
- `MapScreen` now loads users from backend instead of hardcoded mockUsers.ts
- `UserMarker` now accepts `isCurrentUser` as a prop (removed hardcoded db.users[0] check)

## How to test

1. Run `npm run backend` in one terminal
2. Run `npx expo start` in another
3. Sign up with a GitHub username — you should appear on the map
4. Open the db.json to verify the user was saved
5. Hit the refresh button (↻) to reload users from backend
6. Logout — db.json should show the user removed
