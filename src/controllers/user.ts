import express from 'express';
import {getUsers, deleteUserById} from '../db/users';

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

