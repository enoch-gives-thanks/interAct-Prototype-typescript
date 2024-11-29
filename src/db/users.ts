import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    authentication:{
        password: {type: String, required: true, select: false},// we don't want to fetch user info along with their authentication data
        salt: {type:String, select: false},
        sessionToken: {type: String, select:false},
    }
});

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email:string) => UserModel.findOne({email});
export const getUserBySessionToken = (sessionToken:String) => UserModel.findOne({'authentication.sessionToken': sessionToken,})
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then(user => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({_id: id});
export const updateUserById = (id: string, values: Record<string, any>) => {
    return UserModel.findOneAndUpdate(
      { _id: id },            // Filter: Find the user by their `_id`
      { $set: values },       // Update: Set the fields in `values`
      { new: true }           // Options: Return the updated document
    );
  };