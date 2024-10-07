import { defineAction } from "astro:actions";
import { z } from "astro:content";
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { firebase } from "@/firebase/config";
import type { AuthError } from "firebase/auth";

const loginUser = defineAction({
  accept: "form",
  input: z.object({
    email: z
      .string({ message: "Email is required !" })
      .email({ message: "Email format is invalid !" }),
    password: z
      .string({ message: "Password is required !" })
      .min(6, { message: "Password must be at least 6 characters long !" }),
    remember_me: z.boolean({ message: "Remember me must be a boolean value" }).optional(),
  }),
  handler: async (input, context) => {
    //* Cookies
    if (input.remember_me) {
      context.cookies.set("email", input.email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), //? 1 year
        path: "/",
      });
    } else {
      context.cookies.delete("email", { path: "/" });
    }
    
    try {
      await signInWithEmailAndPassword(
        firebase.auth,
        input.email,
        input.password
      );

      return {
        ok: true,
        message: "User authenticated successfully 🎉",
      };
    } catch (error) {
      const firebaseError = error as AuthError;

      if (firebaseError.code === "auth/invalid-credential") {
        throw new Error('Bad Credentials !');
      }

      console.log((error as Error).message);

      throw new Error('Something went wrong 😢, check server logs ⚠️');
    }
  },
});

export default loginUser;