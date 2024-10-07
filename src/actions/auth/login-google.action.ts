import { defineAction } from "astro:actions";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { z } from "astro:content";
import { firebase } from "@/firebase/config";

const loginGoogle = defineAction({
  accept: "json",
  input: z.any(),
  handler: async (credentials) => {
    const credential = GoogleAuthProvider.credentialFromResult(credentials);

    if (!credential) {
      throw new Error("Google login failed");
    }

    await signInWithCredential(firebase.auth, credential);
    return {
      ok: true,
      message: "Logged in successfully 👍✨🎉",
    };
  },
});

export default loginGoogle;