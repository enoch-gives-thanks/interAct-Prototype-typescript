import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers';
// the login function
// create session
// set client session via cookies
export const login = async (req:express.Request, res:express.Response)=>{
    try {
      const {email, password} = req.body;
      if(!email || !password){
        return res.sendStatus(400);
      }
      // it is very important to have this because the default query would not include salt and password
      // allow you to get user.authentication.salt and user.authentication.password
      
      // get the user object fromthe  email information
      const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
      
      if(!user){
        return res.sendStatus(400);
      }
      // use hash comparison to compare user password with database hashs
      const expectedHash = authentication(user.authentication.salt, password);
  
      if(user.authentication.password != expectedHash) {
        return res.sendStatus(403);
      }
  
      // user is authenticated
      // therefore its time to update user session
      const salt = random();
      user.authentication.sessionToken = authentication(salt, user._id.toString());
      // store the sessionToken to the database 
      // so if there is a post or get https request
      // you only need to check the sessionToken inside the https header (encrypted by https protocol)
      await user.save();
  
      // set the session to cookie using http header
      res.cookie('INTERACT-AUTH',  user.authentication.sessionToken, {domain: 'localhost', path: '/'});
  
      return res.status(200).json(user).end();
  
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  }

// the register function
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