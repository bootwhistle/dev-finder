export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  location: string | null;
}

export interface CommunityUser {
  login: string;
  name: string;
  avatar_url: string;
  latitude: number;
  longitude: number;
}
