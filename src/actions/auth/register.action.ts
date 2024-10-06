import { defineAction } from "astro:actions";
import { z } from "astro:content";

const registerUser = defineAction({
  accept: "form",
  input: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    password_confirmation: z.string().min(6),
    remember_me: z.boolean().optional(),
  }).refine(data => data.password === data.password_confirmation, {
    message: "Passwords don't match !",
    path: ["password_confirmation"],
  }),
  handler: async (input, context) => {

    if (input.email) {
      context.cookies.set("email", input.email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), //? 1 year
        path: "/",
      });
    } else {
      context.cookies.delete("email", { path: "/" });
    }

    return {
      ok: true,
      message: "User registered successfully 👍",
    };
  },
});

export default registerUser;