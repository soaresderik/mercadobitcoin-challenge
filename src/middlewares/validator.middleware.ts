/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateAll } from 'indicative/validator';
import { RequestHandler } from 'express';
import HttpException from '../shared/errors/HttpException';

function validator(rules: any, messages = {}): RequestHandler {
  return async (req, res, next) => {
    await validateAll(req.body, rules, messages).catch(err => {
      if (err.length) {
        const message = err
          .map((i: { message: string }) => i.message)
          .join(', ');
        next(new HttpException(message, 400));
      }
    });

    next();
  };
}

export default validator;
