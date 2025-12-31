import { Request, Response } from 'express';
import { EXTERNAL_LINKS } from '../config/googleSheets';

export const getConfigLinks = (req: Request, res: Response) => {
    res.json(EXTERNAL_LINKS);
};
