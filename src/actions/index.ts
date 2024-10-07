import { registerUser, loginUser, loginGoogle, logoutSession } from "./auth";

export const server = {
  //* AUTHENTICATION
  registerUser,
  loginUser,
  loginGoogle,
  logoutSession,
};
