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
  if (!authHeaders) {
    const authValue = authHeaders.split(' ').at(-1) ?? 'user:pass';
    const decodedValue = atob(authValue).split(':');
    const [ user, password ] = decodedValue;
    
    if (user === "admin" && password === "admin") {
      return next();
    }
  }

  return new Response('Forbidden Page', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
      charset: "UTF-8"
    }
  });
};