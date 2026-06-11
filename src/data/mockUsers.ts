import User from '../types';

const db: { users: User[] } = {
  users: [
    {
      id: 1,
      login: 'torvalds',
      name: 'Linus Torvalds',
      avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
      company: 'Linux Foundation',
      bio: null,
      coordinates: { latitude: 51.0460, longitude: -114.0570 },
    },
    {
      id: 2,
      login: 'gaearon',
      name: 'Dan Abramov',
      avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4',
      company: 'Meta',
      bio: 'Working on React',
      coordinates: { latitude: 51.0606, longitude: -114.0930 },
    },
    {
      id: 3,
      login: 'sindresorhus',
      name: 'Sindre Sorhus',
      avatar_url: 'https://avatars.githubusercontent.com/u/170270?v=4',
      company: '@sindresorhus',
      bio: 'Full-Time Open-Sourcerer',
      coordinates: { latitude: 51.0275, longitude: -114.0731 },
    },
    {
      id: 4,
      login: 'tj',
      name: 'TJ Holowaychuk',
      avatar_url: 'https://avatars.githubusercontent.com/u/25254?v=4',
      company: 'Apex',
      bio: null,
      coordinates: { latitude: 51.0590, longitude: -114.0430 },
    },
    {
      id: 5,
      login: 'addyosmani',
      name: 'Addy Osmani',
      avatar_url: 'https://avatars.githubusercontent.com/u/110953?v=4',
      company: 'Google Chrome',
      bio: 'Engineering Manager at Google',
      coordinates: { latitude: 51.0303, longitude: -114.1007 },
    },
  ],
};

export default db;
