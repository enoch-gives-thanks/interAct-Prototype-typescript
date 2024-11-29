Vid: 
https://www.youtube.com/watch?v=b8ZUb_Okxro

Poe:
https://poe.com/chat/2vyaou39qqu8tyd09z3

# Steps:
## Configure
### install typescript and nodemon
pnpm init
pnpm add -D typescript
pnpm add -D ts-node
pnpm add -D nodemon
    Nodemon is a development tool that automatically restarts a Node.js application whenever file changes are detected in the project.

### config typescript 
Create tsconfig.json at root folder (layer 0)
This is a TypeScript configuration file (tsconfig.json) that specifies how the TypeScript compiler (tsc) should behave and how it should compile your TypeScript code. Let’s go through each setting, line by line.
```json
{
    "compilerOptions": {
        "module": "NodeNext",
        "moduleResolution": "nodenext",
        "baseUrl": "src",
        "outDir": "dist",
        "sourceMap": true,
        "noImplicitAny": true,
    },
    "include": ["src/**/*"],
    
}
```
#### config typescript explaination
compilerOptions
The compilerOptions section contains all configuration options that control how TypeScript compiles your code.

##### 1. "module": "NodeNext"
Specifies the module system to be used during compilation.
NodeNext:
Introduced in TypeScript 4.7, it aligns with Node.js's native ESM and CommonJS module support.
It allows TypeScript to handle .js, .ts, .mjs, and .cjs files as modules according to the conditions in the package.json file (e.g., "type": "module" for ESM or "type": "commonjs" for CommonJS).
##### 2. "moduleResolution": "nodenext"
Specifies how TypeScript should resolve module imports (e.g., import or require).
node:
It uses Node.js's module resolution strategy:
Looks for modules in node_modules.
Resolves relative imports (./, ../) and absolute imports based on the baseUrl.
Handles extensions like .js, .ts, .json, etc.
This error occurs because when you set the **`module`** option to `"NodeNext"`, the **`moduleResolution`** option must also be either `"NodeNext"` (or left unspecified, which defaults to `"NodeNext"` when `module` is `"NodeNext"`).

originally in your configuration, you likely have this:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "node", // This is incorrect when module is NodeNext
    ...
  }
}
```

###### **Solution**
To fix this error, change the `moduleResolution` option to `"NodeNext"`, or remove it entirely so TypeScript can infer it automatically.

###### Corrected `tsconfig.json`:
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext", // Correct value
    "baseUrl": "src",
    "outDir": "dist",
    "sourceMap": true,
    "noImplicitAny": true
  },
  "include": ["src/**/*"]
}
```

Or, simply omit the `moduleResolution` property:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "baseUrl": "src",
    "outDir": "dist",
    "sourceMap": true,
    "noImplicitAny": true
  },
  "include": ["src/**/*"]
}
```

---

###### **Why This Happens**
- The **`"NodeNext"`** module system uses Node.js's **ESM and CommonJS interoperability**.
- When `"module": "NodeNext"` is set, TypeScript requires **`moduleResolution`** to match the same logic, i.e., `"NodeNext"`.
- If you set `"moduleResolution": "node"`, it conflicts because `"node"` uses an older resolution strategy incompatible with the `"NodeNext"` module format.

---

###### **What Do These Options Mean?**

1. **`module: "NodeNext"`**:
   - Indicates that TypeScript should treat files as **ES modules (ESM)** or **CommonJS** based on file extensions:
     - `.mjs` and `.mts`: Always treated as ESM.
     - `.cjs` and `.cts`: Always treated as CommonJS.
     - `.js` and `.ts`: Treated as ESM or CommonJS depending on the `"type"` field in `package.json`.

2. **`moduleResolution: "NodeNext"`**:
   - Uses Node.js’s modern resolution strategy for ESM and CommonJS.
   - Resolves imports based on the file extensions and `package.json` settings (like `"exports"` and `"type"`).

---

###### **Key Takeaway**
When using `"module": "NodeNext"`, always use `"moduleResolution": "NodeNext"`, or leave it unspecified so TypeScript can infer the correct resolution strategy.

##### 3. "baseUrl": "src"
Sets the base directory for resolving non-relative module imports.
"src":
This means any non-relative import (e.g., import myModule from "utils";) will be resolved relative to the src folder.
Simplifies imports by avoiding long relative paths like ../../../utils.
##### 4. "outDir": "dist"
Specifies the output directory where the compiled JavaScript files will be placed.
"dist":
After compilation, the .js files and other outputs will be stored in the dist folder.
For example:
src/index.ts → dist/index.js.
##### 5. "sourceMap": true
Generates source maps for your TypeScript files.
Source Maps:
These files map the compiled JavaScript code back to the original TypeScript code.
Useful for debugging, as they allow you to view and debug the original TypeScript code in tools like Chrome DevTools.
##### 6. "noImplicitAny": true
Ensures that all variables, parameters, and return types must have an explicit type, and TypeScript will not infer the any type implicitly.
Example:
 - With "noImplicitAny": true:
```ts
function add(a, b) {
  return a + b; // Error: Parameter 'a' implicitly has an 'any' type.
}
```
Without "noImplicitAny": true:
```ts
function add(a, b) {
  return a + b; // No error, but less strict.
}
```
include
The include option specifies which files or directories should be included in the compilation.

##### 7. "include": ["src/**/*"]
"src/**/*":
Tells TypeScript to include all files and folders inside the src directory (recursively).
The **/* pattern means:
**: Match all subfolders.
*: Match all file names.
Only files with supported extensions (e.g., .ts, .tsx) will be compiled.
##### The Full File, Explained
json
{
    "compilerOptions": {
        "module": "NodeNext",                // Uses Node.js's ESM/CommonJS module system.
        "moduleResolution": "node",         // Resolves modules using Node.js's strategy.
        "baseUrl": "src",                   // Non-relative imports are resolved relative to 'src'.
        "outDir": "dist",                   // Compiled JavaScript files are output to 'dist'.
        "sourceMap": true,                  // Generates source maps for debugging.
        "noImplicitAny": true               // Enforces explicit typing, disallowing implicit 'any'.
    },
    "include": ["src/**/*"]                 // Includes all files in 'src' for compilation.
}
##### What Happens During Compilation?
Input:
TypeScript looks for all .ts files inside the src folder (due to include).
Compilation:
Compiles the TypeScript files according to the compilerOptions.
Adheres to strict typing rules (e.g., noImplicitAny).
Resolves modules with NodeNext rules and uses src as the base for imports.
Output:
Outputs the compiled .js files (and .map files if sourceMap is true) into the dist folder.
Why Use These Settings?
module: NodeNext and moduleResolution: node:
Useful for projects targeting modern Node.js versions that support both ESM and CommonJS.
Allows you to interoperate with Node.js's native module system and package.json settings.
baseUrl: src:
Simplifies imports by avoiding long relative paths.
outDir: dist:
Keeps compiled JavaScript files separate from source TypeScript files.
sourceMap: true:
Enables easier debugging in modern browsers or development tools.
noImplicitAny: true:
Ensures stricter typing, reducing bugs caused by implicit any types.
include: ["src/**/*"]:
Focuses the compiler on the src folder, ensuring that only the source files are compiled.
What Else Can You Add?
You can further customize the tsconfig.json by adding options like:

target: Specify the target JavaScript version (e.g., ES2015, ES2020).
strict: Enables a suite of strict flags, including noImplicitAny.
paths: Define custom module paths for more flexible imports.
lib: Specify which library features to include (e.g., ES2017, DOM).
Example:

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "strict": true,
        "lib": ["ES2020", "DOM"]
    }
}
```
##### Conclusion
This configuration is tailored for a Node.js project using modern module systems (ESM and CommonJS). It enforces strict typing, organizes output files, and simplifies imports, making it a robust setup for a TypeScript project.

### config nodemon
```json
{
    "watch": ["src"],
    "ext": ".ts,.js",
    "exec": "ts-node ./src/index.ts"
}
```

This is a **`nodemon.json` configuration file** that customizes **Nodemon's behavior** for your project. It defines what files to watch, which file extensions to monitor, and what command to execute when files change.

Let’s break it down line-by-line:

---

##### **1. `"watch": ["src"]`**
- This tells Nodemon to **watch** the `src` directory for changes.
- Whenever any file inside the `src` folder (or its subdirectories) changes, Nodemon will restart the specified process.

###### **What It Does:**
- Monitors the `src` folder recursively for file changes.
- Only files or folders listed in the `watch` array will be tracked.

###### **Example:**
If a file like `src/index.ts` or `src/utils/helper.ts` is modified, Nodemon will restart the process.

---

##### **2. `"ext": ".ts,.js"`**
- Specifies the **file extensions** that Nodemon should monitor for changes.
- In this case, Nodemon is watching files with the `.ts` and `.js` extensions.

###### **How It Works:**
- **`.ts`**: Nodemon will restart the process if a TypeScript file (`.ts`) changes.
- **`.js`**: It also restarts the process if a JavaScript file (`.js`) changes.

###### **Why Combine `.ts` and `.js`?**
- This is useful in projects where both TypeScript (`.ts`) and compiled JavaScript (`.js`) files coexist.
- For example:
  - You might be writing TypeScript code, but some parts of the project still rely on JavaScript.
  - Or, you might be debugging compiled `.js` files generated by TypeScript.

###### **Example Change Triggers:**
- `src/index.ts` → Restart.
- `src/app.js` → Restart.

---

##### **3. `"exec": "ts-node ./src/index.ts"`**
- Specifies the **command to execute** when Nodemon restarts the process.

###### **What It Does:**
- Runs the `ts-node` command on the `./src/index.ts` file.
- **`ts-node`**:
  - A tool that allows you to directly execute TypeScript files without compiling them to JavaScript first.
  - It compiles TypeScript to JavaScript in-memory and runs it immediately.
- **`./src/index.ts`**:
  - This is the entry point of your application (likely a `ts` file, but the path might be incorrect; see below).

###### **Why Use `ts-node`?**
- It allows you to run TypeScript files directly, without needing to manually compile them to JavaScript using `tsc` (TypeScript Compiler).
- Great for development workflows where you want rapid iteration.

---

---

##### **Putting It All Together**
Here’s what this configuration does:
1. **Watch the `src` directory**:
   - Nodemon monitors all files in `src` and its subdirectories.
2. **Restart on `.ts` or `.js` file changes**:
   - Nodemon restarts the process whenever a file with the `.ts` or `.js` extension is modified.
3. **Execute `ts-node`**:
   - When a file change is detected, Nodemon runs the `ts-node` command to execute `./src/index.ts` (or the equivalent entry point).

---

##### **How the Workflow Looks**
1. You start Nodemon using:
   ```bash
   nodemon
   ```
2. Nodemon watches the `src` folder for changes.
3. If any `.ts` or `.js` file in `src` changes, Nodemon:
   - Stops the currently running process.
   - Executes the following command to restart it:
     ```bash
     ts-node ./src/index.ts
     ```
4. The TypeScript file is compiled on-the-fly and executed.

---

##### **Example Use Case**
This configuration is ideal for a **TypeScript project** where:
- You are actively developing in TypeScript (`.ts`) files.
- You want to directly run TypeScript code using `ts-node` without pre-compiling it to JavaScript.
- You might also have some `.js` files in your project (e.g., legacy code or external scripts) that you want to track.

---


###### Changes Made:
1. **Corrected the `exec` path**: Points to `index.ts`, the likely entry file.
2. **Simplified `ext`**: Changed to `ts,js` instead of `.ts.js` for better readability.

---

##### **Conclusion**
This `nodemon.json` helps streamline the development process for a TypeScript project by:
- Automatically restarting the application whenever `.ts` or `.js` files in the `src` folder change.
- Leveraging `ts-node` to avoid pre-compiling TypeScript files, saving time during development.

By ensuring the correct configuration, you'll have a smoother TypeScript development workflow!

## create folder structure
### index.ts
windows:
```bat
powershell 
mkdir src; New-Item -Path src\index.ts -ItemType File
```
in index.ts
```ts
console.log("hello typescript");
```
### package.json update
```json
//...
scripts:{
    "start": "nodemon",
    //...
}
```
#### test
pnpm start

output: 
[nodemon] 3.1.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src\**\*
[nodemon] watching extensions: ts,js
[nodemon] starting `ts-node ./src/index.ts`
hello typescript
[nodemon] clean exit - waiting for changes before restart

## Set up express server
src/index.ts
```ts
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

const app = express();

app.use(
    cors({
        credentials: true,
    })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

```
### install the dependence
pnpm i express body-parser cookie-parser compression cors
### install dependence types
pnpm i -D @types/express @types/body-parser @types/cookie-parser @types/compression @types/cors


### add listener to the server we just created
```ts
//...
server.listen(8080, ()=>{
    console.log("Server running on http://localhost:8080/")
})
```
#### test
pnpm start

and go to browser

## setup mongodb in src/index.ts
Windows setup local mongodb 
```ts
//...
const MONGO_URL = 'mongodb://localhost:27017/';
```
```sh,bat
pnpm add mongoose
# pnpm add -D @types/mongoose

# Mongoose publishes its own types, so you do not need to install this package
# pnpm remove @types/mongoose
```

### init mongoose in src/index.ts
```ts
//...
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error:Error) => console.log(error));
```

## Create first database schema

### create folder db and uers.ts
```powershell
New-Item -ItemType Directory -Path src\db -Force; New-Item -ItemType File -Path src\db\users.ts
```
```sh
mkdir -p src/db && touch src/db/users.ts
```

```ts
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
```

Here's a detailed explanation of your code with inline comments for each part:

### **Explanation**

```typescript
import mongoose from 'mongoose';
```
- **Imports the `mongoose` library**: This is used to interact with a MongoDB database in a structured way using schemas and models.

---

### **Define the User Schema**

```typescript
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    authentication:{
        password: {type: String, required: true, select: false}, // Do not include `password` in query results by default
        salt: {type:String, select: false},                      // Do not include `salt` in query results by default
        sessionToken: {type: String, select:false},              // Do not include `sessionToken` in query results by default
    }
});
```

1. **`UserSchema`**: Defines the structure of a `User` document in MongoDB.
   - `username`: A required `String` field.
   - `email`: Another required `String` field.
   - `authentication`: A nested object that stores sensitive authentication details like:
     - `password`: The user's hashed password (not included in query results by default due to `select: false`).
     - `salt`: The salt used to hash the password (also excluded from query results).
     - `sessionToken`: A token for maintaining user sessions (also excluded from query results).
     
   > **Note**: `select: false` ensures sensitive fields like `password`, `salt`, and `sessionToken` are not fetched unless explicitly requested in the query.

---

### **Create the User Model**

```typescript
export const UserModel = mongoose.model('User', UserSchema);
```

- **Creates the `User` model**: This connects the `UserSchema` to the `User` collection in your MongoDB database.
- The `UserModel` is used to perform actions (e.g., CRUD operations) on documents in the `User` collection.

---

#### **Utility Functions**

#### **1. Get All Users**
```typescript
export const getUsers = () => UserModel.find();
```
- **Fetch all users** in the database.
- This uses `UserModel.find()` to retrieve all documents in the `User` collection.

---

#### **2. Get a User by Email**
```typescript
export const getUserByEmail = (email: string) => UserModel.findOne({email});
```
- **Fetch a single user by their email address**:
  - `findOne({ email })`: Finds the first document where the `email` field matches the provided value.

---

#### **3. Get a User by Session Token**
```typescript
export const getUserBySessionToken = (sessionToken: String) => UserModel.findOne({'authentication.sessionToken': sessionToken});
```
- **Fetch a user by their session token**:
  - Searches for a document where the `authentication.sessionToken` field matches the given token.

---

#### **4. Get a User by ID**
```typescript
export const getUserById = (id: string) => UserModel.findById(id);
```
- **Fetch a user by their unique ID**:
  - Uses `findById(id)` to retrieve a document by its `_id` field (MongoDB's unique identifier for documents).

---

#### **5. Create a New User**
```typescript
export const createUser = (values: Record<string, any>) => 
    new UserModel(values).save().then(user => user.toObject());
```
- **Create and save a new user**:
  - `new UserModel(values)`: Creates a new instance of the `UserModel` with the provided data.
  - `.save()`: Saves the new document to the database.
  - `.then(user => user.toObject())`: Converts the returned Mongoose document to a plain JavaScript object (removing Mongoose-specific metadata).

---

#### **6. Delete a User by ID**
```typescript
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({_id: id});
```
- **Delete a user by their ID**:
  - `findOneAndDelete({ _id: id })`: Finds the document with the specified `_id` and deletes it.

---

#### **7. Update a User by ID**
```typescript
export const updateUserById = (id: string, values: Record<string, any>) => {
    return UserModel.findOneAndUpdate(
        { _id: id },            // Find the document with this `_id`
        { $set: values },       // Update the fields specified in `values`
        { new: true }           // Return the updated document instead of the old one
    );
};
```
- **Update a user's details by their ID**:
  - `{ _id: id }`: The filter to find the user by their `_id`.
  - `{ $set: values }`: Specifies the fields to update.
  - `{ new: true }`: Ensures the updated document is returned after the update (by default, Mongoose returns the document as it was before the update).

---

#### **Summary**

This code defines a reusable **User schema and model** for a MongoDB database using Mongoose. It provides utility functions for common operations:

1. **Get Users**:
   - Retrieve all users or specific users by email, session token, or ID.
2. **Create User**:
   - Add a new user to the database.
3. **Delete User**:
   - Remove a user by their ID.
4. **Update User**:
   - Modify a user's data by their ID.

The schema uses `select: false` for sensitive fields like `password`, `salt`, and `sessionToken`, ensuring they are not returned in queries unless explicitly requested. This is a **best practice** for security in database design.



## create helper folder and its index.ts for authetication
```powershell
New-Item -ItemType Directory -Path src\helpers -Force; New-Item -ItemType File -Path src\helpers\index.ts
```
```sh
mkdir -p src/helpers && touch src/helpers/index.ts
```
in src/helpers/index.ts
```ts
import cryto from 'crypto';
const SECRET = 'Thank-God-for-interAct-Take-rest-God-provides';

export const random = () => cryto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    return cryto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};
```

## create routing for authetication in controllers
```powershell
New-Item -ItemType Directory -Path src\controllers -Force; New-Item -ItemType File -Path src\controllers\authentication.ts
```
```sh
mkdir -p src/controllers && touch src/controllers/authentication.ts
```
Create the first controller
in src/controllers/authentication.ts
```ts
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
            return ;
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
        next( res.sendStatus(400));
    }
}
```

## create a route

```powershell
New-Item -ItemType Directory -Path src\router -Force; New-Item -ItemType File -Path src\router\index.ts
```
```sh
mkdir -p src/router && touch src/router/index.ts
```

in  src/router/index.ts
```ts
import express from 'express';
const router = express.Router();
export default (): express.Router => {
    return router;
}
```

### Create router authentication
```powershell
New-Item -ItemType Directory -Path src\router; New-Item -ItemType File -Path src\router\authentication.ts
```
```sh
mkdir -p src/router && touch src/router/authentication.ts
```
```ts
import express from 'express';

import {register} from '../controllers/authentication'

export default (router: express.Router) => {
    router.post('/auth/register', register );
}
```
