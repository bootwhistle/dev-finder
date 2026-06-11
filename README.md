# DevFinder

A React Native mobile app that helps developers find peers in their geographic area. Built with Expo and TypeScript for SODV2251 — Mobile Application Development.

## Screens

- **Sign Up** — Enter a GitHub username to join the community. Validates against the GitHub API.
- **Map** — Full-screen map showing community members as avatar pins. Tap a pin to see their name and username.
- **GitHub Profile** — Tap a tooltip to view that developer's GitHub profile in a web view.

## Tech Stack

- [Expo](https://expo.dev) (SDK 54) + React Native + TypeScript
- [React Navigation](https://reactnavigation.org) — stack navigation
- [react-native-maps](https://github.com/react-native-maps/react-native-maps) — map view with custom markers
- [react-native-webview](https://github.com/react-native-community/react-native-webview) — GitHub profile wrapper
- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) — persist sign-in state

## Getting Started

```bash
npm install
npm start
```

Scan the QR code with [Expo Go](https://expo.dev/go) on your device.

## Project Structure

```
src/
  context/UserContext.tsx   # Auth state + GitHub API
  screens/
    SignUpScreen.tsx
    MapScreen.tsx
    ProfileScreen.tsx
  components/
    UserMarker.tsx          # Avatar pin + callout tooltip
  data/mockUsers.ts         # Community users with coordinates
  types/index.ts
  theme.ts
```

## Notes

Mock user data uses hardcoded Bay Area coordinates. Replace `src/data/mockUsers.ts` with a real backend call when deploying for a specific institution.
