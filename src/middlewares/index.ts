import { Request, Response, NextFunction } from 'express';
import { 
    get,
    merge 
} from 'lodash';
import { getUserBySessionToken } from '../db/users';

export const isOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        //check for the id parameters
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string; // tell typescript it is a string


        if(!currentUserId){
            res.sendStatus(403);
            return; //return void to avoid loops
        }

        if(currentUserId.toString()!== id){
            res.sendStatus(403);
            return; //return void to avoid loops
        }
        next();
    } catch (error) {
        console.error(error); // Use console.error for error logging
        res.sendStatus(400);
    }
}

export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract session token from cookies
        // make sure you return void
        const sessionToken = req.cookies['INTERACT-AUTH'];
        if (!sessionToken) {
            res.sendStatus(403);
            return;
        }

        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) {
            res.sendStatus(403);
            return;
        }

        // Merge user information into the response object
        merge(res, { identity: existingUser });

        // Call the next middleware function
        next();
    } catch (error) {
        console.error(error); // Use console.error for error logging
        res.sendStatus(400);
    }
};