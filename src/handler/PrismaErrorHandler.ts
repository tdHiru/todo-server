import { Prisma, PrismaClient } from '@prisma/client';
import type { Response, Request, NextFunction } from 'express';

export const handlePrismaError = (e: any, req: Request, res: Response,  next: NextFunction) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2025') {
                // P2025: An operation failed because it depends on one or more records that were required but not found.
                return res.status(404).json({ error: 'Todo not found' });
            }
        }
        // console.log(e);
        if (e instanceof Error) {
            return res.status(500).json({ error: e.message });
        }
        return res.status(500).json({ error: 'An unknown error occurred' });
    }

