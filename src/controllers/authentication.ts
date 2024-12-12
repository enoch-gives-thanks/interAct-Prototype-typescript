import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers';

export const register = async (
    req:express.Request, 
    res: express.Response,
    next: express.NextFunction // Add `next` to ensure it matches Express's handler type
): Promise<void> => {
    try {
        // registration process
        const {email, password, username} = req.body // we define in user.ts

        if(!email || !password || !username){
            res.status(400).json({ error: 'Missing required fields' });
            return ; // the return statements are used to exit the function early and prevent further execution
        }

        const existingUser = await getUserByEmail(email);

        if(existingUser){
            res.status(400).json({ error: 'User already exists' });
            return ;
        }

        // create the authentication
        const salt = random();

        // create user
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            }
        })
        res.status(201).json({ user }).end();
        return ;

    }catch (error) {
        console.log(error);
        next(error);
    }
}