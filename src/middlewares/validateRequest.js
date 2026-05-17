import { HttpError } from '../utils/httpError.js';

export function validateBody(schema) {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return next(new HttpError(400, message));
    }

    req.body = value;
    return next();
  };
}
