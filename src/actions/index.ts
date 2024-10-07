import { registerUser, loginUser, logoutSession } from "./auth";

export const server = {
  //* AUTHENTICATION
  registerUser,
  loginUser,
  logoutSession,
};
