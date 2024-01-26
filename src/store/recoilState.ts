import { RecoilState, atom } from 'recoil';
import { User } from 'src/api/DataType';

export const tokenState = atom({
  key: 'token',
  default: '',
});

export const userState = atom<User | null>({
  key: 'user',
  default: null,
});
