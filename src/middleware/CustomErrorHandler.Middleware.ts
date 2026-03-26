// middlewares/error-handler.ts
import { Request, Response, NextFunction } from 'express';
import { CustomError } from './CustomError.Middleware';
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction // The 'next' parameter is essential for Express to treat this as error middleware
) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }

    // For unhandled, generic errors
    console.error(err); // Log the error for debugging
    res.status(500).send({
        errors: [{ message: 'Something went wrong' }]
    });
};
