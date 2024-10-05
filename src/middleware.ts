import { defineMiddleware } from "astro:middleware";

const privateRoutes = [
  '/protected',
];

export const onRequest = defineMiddleware((context, next) => {

  const authHeaders = context.request.headers.get('authorization');

  if (privateRoutes.includes(context.url.pathname)) {
    if (authHeaders) {
      return next();
    }
    return new Response('Forbidden Page', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      }
    });
  }

  return next();
});
