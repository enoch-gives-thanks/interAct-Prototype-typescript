import express from 'express';
import {getUsers, deleteUserById, updateUserById, getUserById} from '../db/users';

export const getAllUsers = async (
    req: express.Request, 
    res: express.Response
): Promise<any>=>{
  try{
    const users = await getUsers();
    res.status(200).json(users);

  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const deleteUserController = async (
    req: express.Request,
    res: express.Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);
    res.status(200).json(deletedUser);
    return;
  } catch (error){
    console.log(error);
    res.sendStatus(400);
  }
}

export const updateUserController = async (
  req: express.Request,
  res: express.Response
): Promise<any> => {
  try{
    const { id } = req.params;
    const { username } = req.body;
    if(!username) {
      return res.sendStatus(400);
    }
    const user = await getUserById(id);
    user.username = username;
    await user.save();
    res.status(201).json({ user }).end();

    return;

  }catch (error){
    console.log(error);
    res.sendStatus(400);
  }
}