import { defineMiddleware } from "astro:middleware";
import { firebase } from "./firebase/config";

const privateRoutes = [
  '/protected',
];

const notAuthenticatedRoutes = [
  '/home',
  '/login',
  '/register',
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

    if (!isLoggedIng && privateRoutes.includes(context.url.pathname)) {
      return context.redirect('/login');
    }

    if (isLoggedIng && notAuthenticatedRoutes.includes(context.url.pathname)) {
      return context.redirect('/');
    }

    return next();
  }
);
