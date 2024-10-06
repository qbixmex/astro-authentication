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
  handler: async (form) => {
    return {
      "name": form.name,
      "email": form.email,
      "password": form.password,
      "password-confirmation": form.password_confirmation,
      "remember-me": form.remember_me,
    };
  },
});

export default registerUser;