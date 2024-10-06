import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:content";

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
    if (input.email) {
      context.cookies.set("email", input.email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), //? 1 year
        path: "/",
      });
    } else {
      context.cookies.delete("email", { path: "/" });
    }

    if (!context.cookies.has('user-session')) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "User must be logged in.",
      });
    }
    
    try {
      return {
        ok: true,
        message: "User registered successfully 👍",
      };
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong 😢, check server logs ⚠️');
    }
  },
});

export default registerUser;