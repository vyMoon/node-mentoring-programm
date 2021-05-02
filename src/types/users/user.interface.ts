import { UserForFrontEnd } from './user-for-frontend.interface';

export interface User extends UserForFrontEnd{
  isDeleted: boolean
}
