export const validateRequest = (schemas) => (req, _res, next) => {
  try {
    const targets = ['body', 'params', 'query', 'cookies'];

    for (const target of targets) {
      if (schemas[target] && req[target]) {
        const validatedData = schemas[target].parse(req[target]);
        // Modify the object content instead of reassigning the property
        Object.assign(req[target], validatedData);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
