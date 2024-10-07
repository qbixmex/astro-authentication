/// <reference path="../.astro/types.d.ts" />

interface User {
  displayName: string;
  email: string;
  emailVerified: boolean;
  avatar: string;
}

declare namespace App {
  interface Locals {
    isLoggedIn: boolean;
    user: User | null;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_API_KEY: string;
  readonly PUBLIC_AUTH_DOMAIN: string;
  readonly PUBLIC_PROJECT_ID: string;
  readonly PUBLIC_STORAGE_BUCKET: string;
  readonly PUBLIC_MESSAGING_SENDER_ID: string;
  readonly PUBLIC_APP_ID: string;
  readonly PUBLIC_HOLA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
