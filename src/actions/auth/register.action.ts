import { defineAction } from "astro:actions";
import { z } from "astro:content";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { firebase } from "@/firebase/config";
import type { AuthError } from "firebase/auth";

const registerUser = defineAction({
  accept: "form",
  input: z.object({
    name: z.string({ message: "Name is required !" }),
    email: z
      .string({ message: "Email is required !" })
      .email({ message: "Email format is invalid !" }),
    password: z
      .string({ message: "Password is required !" })
      .min(6, { message: "Password must be at least 6 characters long !" }),
    password_confirmation: z
      .string({ message: "Password Confirmation is required !" })
      .min(6, { message: "Password Confirmation must be at least 6 characters long !" }),
    remember_me: z.boolean({ message: "Remember me must be a boolean value" }).optional(),
  }).refine(data => data.password === data.password_confirmation, {
    message: "Passwords don't match !",
    path: ["password_confirmation"],
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
      await createUserWithEmailAndPassword(
        firebase.auth,
        input.email,
        input.password
      );

      //* Update display name
      updateProfile(firebase.auth.currentUser!, {
        displayName: input.name
      });

      //* Check email verification
      await sendEmailVerification(firebase.auth.currentUser!, {
        url: `${import.meta.env.PUBLIC_DOMAIN}/protected?emailVerified=true`,
      });

      return {
        ok: true,
        message: "User registered successfully 🎉",
      };
    } catch (error) {
      const firebaseError = error as AuthError;

      if (firebaseError.code === "auth/email-already-in-use") {
        throw new Error('Email is already in use !');
      }

      console.log((error as Error).message);

      throw new Error('Something went wrong 😢, check server logs ⚠️');
    }
  },
});

export default registerUser;