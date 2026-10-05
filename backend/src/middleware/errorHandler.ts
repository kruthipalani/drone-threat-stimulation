import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error('Backend Error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
}
