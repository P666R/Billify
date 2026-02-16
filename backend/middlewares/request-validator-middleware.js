// usage router.post('/...', validateRequest({ body: registerUserSchema }), controller);
export const validateRequest = (schemas) => (req, _res, next) => {
  try {
    const targets = ['body', 'params', 'query'];

    for (const target of targets) {
      if (schemas[target]) {
        req[target] = schemas[target].parse(req[target]);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
