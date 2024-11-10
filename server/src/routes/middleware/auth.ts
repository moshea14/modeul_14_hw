import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const { verify } = jwt;

// Create a middleware function that blocks unauthenticated users from triggering user ONLY routes
export const blockGuests = (req: Request, res: Response, next: NextFunction): void => {
  // Retrieve the token cookie from req.cookies
  const token = req.cookies.token;

  // If the token cookie does not exist, send a 401 json response message and return
  if (!token) {
    res.status(401).json();
    return;
  }

  // If the token exists, validate it with the verify function
  verify(token, process.env.JWT_SECRET as string, (err: any) => {
    if (err) {
      // If it doesn't verify send a 401 json response message and DO NOT call next
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // If it verifies, call next to move the request on to the controller function
    return next();
  });
};