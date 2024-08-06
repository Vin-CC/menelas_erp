/**
 * An array of routes that are accessible to the public
 * These routes do note require authentification
 * @type {string[]}
 */
export const publicRoutes = [
] as string[]

/**
 * An array of routes that are used for authentification
 * These routes will redirect logged in users to /
 * @type {string[]}
 */
export const authRoutes = [
    "/login",
    "/login/erreur",
    "/login/verifier-mails"
];

/**
 * The prefix for API authentification routes
 * Routes that start with this prefix are used for API authentifiaction purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECTION = "/";