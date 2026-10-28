/**
 * Express 4 does not catch rejected promises from async handlers — an uncaught
 * rejection (e.g. a DB error) crashes the whole process. Wrap every async route.
 */
export const asyncRoute = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/** An error the error handler returns to the client as-is (4xx). */
export function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
