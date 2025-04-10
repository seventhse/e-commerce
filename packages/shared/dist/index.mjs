const ResponseCode = {
  // System level errors: 1-999
  UNKNOWN_ERROR: 1,
  SUCCESS: 200,
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500
};

export { ResponseCode };
