# DevFinder — Project 3 (SODV2251)

Expo + TypeScript React Native app. Builds on P2 UI by adding real data flows.

## Running

**Terminal 1 — backend:**
```
npm run backend
```
Starts JSON-Server on port 3000 using `db.json` as the database.

**Terminal 2 — app:**
```
npx expo start
```

## Backend URL

`src/config.ts` controls the API base URL:
- Android emulator: `http://10.0.2.2:3000` (default)
- iOS simulator: `http://localhost:3000`
- Physical device: your machine's LAN IP, e.g. `http://192.168.1.x:3000`

## Data flow

1. User enters GitHub username on SignUpScreen
2. App requests location permission and gets GPS coordinates
3. GitHub API validates the username and returns profile data
4. User is POSTed (or PATCHed if already exists) to JSON-Server with coordinates
5. MapScreen fetches all users from JSON-Server and renders markers
6. Logout deletes the user from JSON-Server (removes them from the map)

## Key files

| File | Purpose |
|------|---------|
| `db.json` | JSON-Server database (starts empty) |
| `src/config.ts` | Backend URL — change when switching device/emulator |
| `src/services/api.ts` | fetchUsers / registerUser / removeUser |
| `src/context/UserContext.tsx` | GPS + GitHub + backend registration flow |
| `src/screens/MapScreen.tsx` | Fetches users from backend, refresh button |
| `src/components/UserMarker.tsx` | Map pin; current user shown larger |
