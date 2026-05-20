export const validateRequest = (schemas) => (req, _res, next) => {
  try {
    const targets = ['body', 'params', 'query', 'cookies'];

    // Initialize container to prevent overwriting across multiple validation middlewares
    // Required since req.query in express 5 is read-only
    req.valid = req.valid || {};

    for (const target of targets) {
      if (schemas[target] && req[target]) {
        req.valid[target] = schemas[target].parse(req[target]);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
