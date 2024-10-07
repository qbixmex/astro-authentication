import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";
import { firebase } from "./firebase/config";

const privateRoutes = [
  '/protected',
];

export const onRequest = defineMiddleware(
  (context, next) => {
    const isLoggedIng = !!firebase.auth.currentUser;
    const user = firebase.auth.currentUser;

    //* Assign to locals the user authenticated status.
    context.locals.isLoggedIn = isLoggedIng;

    //* Assign to locals the user data from authenticated user.
    if (user) {
      context.locals.user = {
        displayName: user.displayName!,
        email: user.email!,
        emailVerified: user.emailVerified,
        avatar: user.photoURL ?? '',
      }
    }

    return next();
  }
);
