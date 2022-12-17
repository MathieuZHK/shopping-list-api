import * as bcrypt from 'bcrypt';

const userData = [
  {
    id: 'generated',
    nickname: 'mathieu',
    email: 'ziajkam@gmail.com',
    password: '',
    isActive: true,
  },
  {
    id: 'generated',
    nickname: 'michel',
    email: 'olivier.m@seeddata.fr',
    password: '',
    isActive: true,
  },
  {
    id: 'generated',
    nickname: 'lenoir',
    email: 'lenoir.a@seeddata.fr',
    password: '',
    isActive: true,
  },
  {
    id: 'generated',
    nickname: 'gaudin',
    email: 'gaudin.c@seeddata.fr',
    password: '',
    isActive: true,
  },
  {
    id: 'generated',
    nickname: 'buisson',
    email: 'buisson.g@seeddata.fr',
    password: '',
    isActive: true,
  },
  {
    id: 'generated',
    nickname: 'menard',
    email: 'menard.m@seeddata.fr',
    password: '',
    isActive: true,
  },
  {
    id: 'generated',
    nickname: 'voisin',
    email: 'voisin.g@seeddata.fr',
    password: '',
    isActive: false,
  },
];

export async function getUserDataForSeed() {
  const hash = await bcrypt.hash('password', 10);
  console.log(hash);
  for (const user of userData) {
    user.password = hash;
  }
  return userData;
}

export const userSeed = {
  getUserDataForSeed,
};
