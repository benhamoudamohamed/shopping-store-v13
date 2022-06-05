import { UserRole } from "@shoppingstore/api-interfaces";

export interface User {
  id: string;
  fullname: string;
  email: string;
  password: string;
  isActivated: boolean;
  userRole: UserRole;
  accessToken: string;
  refreshToken: string;
  created: Date;
}
