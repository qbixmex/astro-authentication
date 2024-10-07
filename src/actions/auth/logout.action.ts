import { defineAction } from "astro:actions";
import { signOut } from "firebase/auth";
import { firebase } from "@/firebase/config";

const logout = defineAction({
  accept: "json",
  handler: async () => await signOut(firebase.auth),
});

export default logout;