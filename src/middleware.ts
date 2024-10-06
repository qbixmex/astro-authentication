import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";

const privateRoutes = [
  '/protected',
];

export const onRequest = defineMiddleware((context, next) => {
  const authHeaders = context.request.headers.get('authorization') ?? '';

  if (privateRoutes.includes(context.url.pathname)) {
    return checkAuth(authHeaders, next);
  }

  return next();
});

const checkAuth = (authHeaders: string, next: MiddlewareNext) => {
  return next();
};