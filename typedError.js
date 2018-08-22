import mongoose from 'mongoose';

export class TypedError extends Error {
  constructor (code, message, type) {
    super(message);
    this.httpStatus = code;
    this.message = message;
    this.type = type;
  }
}

export function handleError (err, res, code) {
  if (!err.httpStatus) {
    console.log(err);
    res.status(500).send({ message: 'internal error' });
  } else {
    res.status(err.httpStatus).send({ message: err.message, type: err.type });
  }
};

export function convertStringToId (id) {
  try {
    return mongoose.Types.ObjectId(id);
  } catch (err) {
    throw new TypedError(400, 'Invalid Id');
  }
};
