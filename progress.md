Vid: 
https://youtu.be/b8ZUb_Okxro?feature=shared&t=1925

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
linux:
```sh
mkdir src && touch src/index.ts
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
const MONGO_URL = 'mongodb://localhost:27017/interact';
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
```ts
cryto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
```
of code is using the Node.js `crypto` module to generate a hashed output (in hexadecimal format) based on a combination of a salt, a password, and a secret key. Let's break it down step by step:

```javascript
return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
```

### 1. `crypto.createHmac('sha256', [salt, password].join('/'))`
- **`crypto.createHmac`**: This method creates an HMAC (Hash-based Message Authentication Code) using a specified hash function and a key.
- **`'sha256'`**: This specifies the hash algorithm used, in this case, SHA-256 (a secure hashing algorithm).
- **`[salt, password].join('/')`**: 
  - `[salt, password]` creates an array containing the `salt` and `password` values.
  - `.join('/')` combines the two values into a single string, separated by a `/`. For example:
    ```javascript
    const salt = '1234';
    const password = 'mypassword';
    console.log([salt, password].join('/')); 
    // Output: "1234/mypassword"
    ```
  - This combined string is used as the **key** for the HMAC.

### 2. `.update(SECRET)`
- **`update(SECRET)`**: This method specifies the data to be hashed using the HMAC. The `SECRET` value is the input data provided for hashing. For example, this could be a secret key or some sensitive information.

### 3. `.digest('hex')`
- **`digest('hex')`**: This finalizes the HMAC computation and outputs the result as a hexadecimal string. The hexadecimal format is a common way of representing hashed data.

### What does this line do overall?
1. It creates an HMAC using:
   - The SHA-256 hash algorithm.
   - A key that is a combination of `salt` and `password`, joined by `/`.
2. It hashes the `SECRET` value using that HMAC.
3. It returns the resulting hash as a hexadecimal string.

### Example of Usage
Here's an example to illustrate how it works:

```javascript
const crypto = require('crypto');

const salt = '1234'; // Example salt
const password = 'mypassword'; // Example password
const SECRET = 'sensitive-data'; // Data to hash

const result = crypto
  .createHmac('sha256', [salt, password].join('/'))
  .update(SECRET)
  .digest('hex');

console.log(result); // Outputs something like: "5a8dd3ad0756a93ded72b823b19dd877"
```

### Why is this useful?
This kind of hashing is typically used for:
- **Password hashing**: Combining a salt and password ensures that even if two users have the same password, their hashed values will be different.
- **Data integrity**: HMAC ensures that data cannot be tampered with without the key.
- **Authentication**: It is useful for verifying the authenticity of data or messages.

### Important Notes:
1. **Security Best Practices**:
   - Ensure `salt` is unique for each user or piece of data.
   - Use a strong, randomly generated `SECRET` key.
2. **Hashing Passwords**: If this is being used for password hashing, consider using specialized libraries like `bcrypt` or `argon2`, as they are specifically designed for securely hashing passwords.


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
#### updat router/index.ts
Adding the router authentication function wrapping the path 
 - '/auth/register'
```ts
// import express from 'express';
import authentication from './authentication'; // ADD THIS LINE
// const router = express.Router();

// export default (): express.Router => {
    authentication(router); // ADD THIS LINE
    // return router;
// }
```

#### update the src/index.ts
```ts
// import express from 'express';
// import http from 'http';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import compression from 'compression';
// import cors from 'cors';
// import mongoose from 'mongoose';
import router from './router'; // ADD THIS LINE

// const app = express();

// app.use(
//     cors({
//         credentials: true,
//     })
// );
// app.use(compression());
// app.use(cookieParser());
// app.use(bodyParser.json());

// const server = http.createServer(app);

// server.listen(8080, ()=>{
//     console.log("Server running on http://localhost:8080/")
// })

// const MONGO_URL = 'mongodb://localhost:27017/';
// mongoose.Promise = Promise;
// mongoose.connect(MONGO_URL);
// mongoose.connection.on('error', (error:Error) => console.log(error));

app.use('/', router()); // ADD THIS LINE
```
## test out registration in postman
http://localhost:8080/auth/register

{
    "email": "abc@gmail.com",
    "password": "wer234sfd",
    "username": "interAct"
}

excepted return:

{
    "user": {
        "username": "interAct",
        "email": "abc@gmail.com",
        "authentication": {
            "password": "978eb94ad5e60c9ffcb2831c385d275a0225a18168c73ad7b8af7d2fc3d74012",
            "salt": "LGbxwPdisavIBa6zG7uBo9jKMCpl52qjjiW7gcDoWdftq3Urw5TKnmhNvKqq/vI2tjxdIWADomr7o6BycNdWQjNzlaLJ6jamvTOv944X9jtR7McRBJwBcgtiPeBHS7Jy+VwRJIPYAZv02D80IBrXCzm3WJ7jQJCtZRN8Uj9nx2I="
        },
        "_id": "67498512ef98b90871cf583e",
        "__v": 0
    }
}

in Mongo DB:
local -> database -> interact
```json
{
  "_id": {
    "$oid": "674986122701fa467bfd7664"
  },
  "username": "interAct",
  "email": "abc@gmail.com",
  "authentication": {
    "password": "6b8c6c4019e50e04e6e09465adbd55ff308a44d6a21122fe34e0e4c33674db5e",
    "salt": "nB7EVkFDKQAk41vYLm6ica9NclWnIM3/nWjKl2fNa64wuoadM+QZTJ/H8o0FpXtsUZ7w6bv0EAXkl+YTY/pc2ozCKyorsSiTTHBizwPPGt0VZMcgetoUPmM9IBddXB5jJIYuc6zg7A1LVnR1nzqnnIy15QgT6/0Qz3XWa/OQ/b4="
  },
  "__v": 0
}
```

## create login controllers
In the login controller
in src/controllers/authentication.ts

Now we need to create a verification function called loginVerification

```ts
// import express from 'express';
// import { createUser, getUserByEmail } from '../db/users';
// import { authentication, random } from '../helpers';

// add this loginVerification function
export const loginVerification = async (req: express.Request, res: express.Response) => {
  try {
    const {email, password} = req.body; // get post attributes from body request

    // make sure the reqest contain email and password
    if(!email || !password){
      return res.sendStatus(400);
    }
    
    // check if there is a user with the email provided
    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    // .select(): This method is used to specify which fields should be included or excluded in the query result. This is common in ORMs like Mongoose.
    // '+authentication.salt +authentication.password':
    // In some ORMs (e.g., Mongoose), fields can be excluded by default for security reasons (e.g., sensitive information like passwords, salts, etc.).
    // The + symbol explicitly includes fields that are normally excluded.
    // Here, the query is explicitly requesting the authentication.salt and authentication.password fields, which might have been marked as excluded in the schema definition.

    if(!user){
      return res.sendStatus(400);
    }
    // check password word by comparing the hash and the database

    const expectedHash = authentication(user.authentication.salt, password); // authenication hash the password with the salt and secret
    if(user.authentcation.password != expectedHash){
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.essionToken = authentication(salt, user._id.toString());


  }catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

// export const register = async (
//     req:express.Request, 
//     res: express.Response,
//     next: express.NextFunction // Add `next` to ensure it matches Express's handler type
// ): Promise<void> => {
//     try {
//         // registration process
//         const {email, password, username} = req.body // we define in user.ts

//         if(!email || !password || !username){
//             res.status(400).json({ error: 'Missing required fields' });
//             return ;
//         }

//         const existingUser = await getUserByEmail(email);

//         if(existingUser){
//             res.status(400).json({ error: 'User already exists' });
//             return ;
//         }

//         // create the authentication
//         const salt = random();

//         // create user
//         const user = await createUser({
//             email,
//             username,
//             authentication: {
//                 salt,
//                 password: authentication(salt, password),
//             }
//         })
//         res.status(201).json({ user }).end();
//         return ;

//     }catch (error) {
//         console.log(error);
//         next( res.sendStatus(400));
//     }
// }
```

#### explain this line => const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

This line of code is a JavaScript/TypeScript snippet, likely used in a Node.js or similar backend environment, where the **`getUserByEmail` function** is used to fetch a user object from a database, typically through an **ORM** (Object-Relational Mapper) like **Mongoose** (used with MongoDB). Let's break it down step by step:

---

#### **1. `const user = await getUserByEmail(email)`**
- **`getUserByEmail(email)`**: This function is called to fetch the user data associated with the given email address. It's likely querying a database for a user record.
- **`await`**: The use of `await` indicates that `getUserByEmail` is an **asynchronous function** (returns a `Promise`). This means the code will wait for the function to resolve before assigning the result to `user`.
- **`const user`**: The result of the asynchronous call is stored in the `user` variable.

---

#### **2. `.select('+authentication.salt +authentication.password')`**
- **`.select()`**: This method is used to specify which fields should be included or excluded in the query result. This is common in ORMs like **Mongoose**.
  
- **`'+authentication.salt +authentication.password'`**:
  - In some ORMs (e.g., Mongoose), fields can be **excluded by default** for security reasons (e.g., sensitive information like passwords, salts, etc.).
  - The `+` symbol explicitly includes fields that are normally excluded.
  - Here, the query is explicitly requesting the `authentication.salt` and `authentication.password` fields, which might have been marked as excluded in the schema definition.

---

#### **What does this do in practice?**
The code fetches a user object from the database based on the email address and explicitly includes the sensitive fields `authentication.salt` and `authentication.password` in the result, even if those fields are excluded by default in the database schema or query configuration.

---

#### **Example Use Case**
This could be part of a **login system**, where the application:
1. Retrieves the stored `salt` and `password` hash for a user.
2. Uses them to verify the user's credentials during authentication.

---

#### **Mongoose Example**
Here’s an example of how this might work in **Mongoose**:

```javascript
const mongoose = require('mongoose');

// Define a User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  authentication: {
    salt: { type: String, select: false },
    password: { type: String, select: false },
  },
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Function to get a user by email with sensitive fields
async function getUserByEmail(email) {
  return await User.findOne({ email });
}

// Querying the user
const email = "example@example.com";
const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

console.log(user);
```

---

#### **Why Use `.select()`?**
- Improves **security**: Sensitive data (like passwords or salts) is excluded from queries by default.
- Provides **flexibility**: You can selectively include sensitive data when needed (e.g., for authentication purposes).

---

#### **Important Note**
You should always handle sensitive data like passwords and salts securely:
- Never store plain-text passwords in a database; always hash them using secure algorithms like **bcrypt** or **argon2**.
- Avoid exposing sensitive data (like salts and password hashes) in API responses.


### create the login function - login controller and the authentication function
In the login controller
in src/controllers/authentication.ts
```ts
//...
export const login = async (req:express.Request, res:express.Response)=>{
  try {
    const {email, password} = req.body;
    if(!email || !password){
      return res.sendStatus(400);
    }
    // it is very important to have this because the default query would not include salt and password
    // allow you to get user.authentication.salt and user.authentication.password
    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    
    if(!user){
      return res.sendStatus(400);
    }
    // use hash comparison to compare user password with database hashs
    const expectdHash = authenication(user.authentication.salt, password);

    if(user.authentication.password != expectedHash) {
      return res.sendStatus(403);
    }

    // user is authenticated
    // therefore its time to update user session
    const salt = random();
    user.authentication.sessionToken = authentication(salt, user_id.toString());
    // store the sessionToken to the database 
    // so if there is a post or get https request
    // you only need to check the sessionToken inside the https header (encrypted by https protocol)
    await user.save();

    // set the session to cookie using http header
    res.cookie('INTERACT-AUTH',  user.authentication.sessionToken);

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

// export const register = ...
```
#### Explaination of how cookies, session and http header works:
Cookies, sessions, and HTTP headers are fundamental concepts in web development and play important roles in managing user state and transmitting information between the client (usually a web browser) and the server. Let's dive into each of them:

1. Cookies:
   - Cookies are small pieces of data stored on the client-side by websites.
   - When a server sends a response to a client, it can include a `Set-Cookie` header, which instructs the browser to store the cookie.
   - Cookies are typically used to store user preferences, authentication tokens, or session identifiers.
   - Each cookie has a name, value, expiration date, and other optional attributes.
   - When the client sends subsequent requests to the same domain, it includes the stored cookies in the `Cookie` header of the request.
   - Servers can read the cookies from the request headers to identify the user and maintain state across requests.
   - Cookies have a size limit (usually around 4KB) and can be set with an expiration date or as session cookies (deleted when the browser is closed).

2. Sessions:
   - Sessions are server-side storage mechanisms used to persist data across multiple requests from the same client.
   - When a user logs in or starts a session, the server creates a unique session identifier (session ID) and sends it to the client as a cookie.
   - The server maintains a mapping between the session ID and the associated session data, which can include user information, preferences, or any other relevant data.
   - On subsequent requests, the client sends the session ID cookie, allowing the server to retrieve the corresponding session data.
   - Sessions are commonly used for user authentication, shopping carts, or any scenario where data needs to be maintained across requests.
   - Session data is stored on the server-side and can be stored in memory, files, or databases, depending on the server's configuration.

3. HTTP Headers:
   - HTTP headers are key-value pairs included in the header section of HTTP requests and responses.
   - Headers provide additional information about the request or response, such as the content type, encoding, cache control, authentication tokens, and more.
   - Some commonly used headers include:
     - `Content-Type`: Specifies the media type of the request or response body (e.g., `application/json`, `text/html`).
     - `Authorization`: Contains authentication credentials, such as tokens or basic auth details.
     - `Cache-Control`: Controls caching behavior, indicating whether the response can be cached and for how long.
     - `Cookie`: Contains the cookies sent by the client to the server.
     - `Set-Cookie`: Used by the server to instruct the client to store cookies.
   - Headers are extensible, and developers can define custom headers for specific purposes.
   - HTTP headers are essential for controlling various aspects of the communication between the client and the server, such as authentication, caching, content negotiation, and more.

Cookies, sessions, and HTTP headers work together to enable stateful communication and user-specific functionality in web applications. Cookies are used to store small amounts of data on the client-side, sessions allow the server to maintain user state across requests, and HTTP headers provide additional information and control over the request-response cycle.

Understanding how these concepts interact is crucial for building secure, scalable, and user-friendly web applications. Proper handling of cookies, sessions, and headers is essential for authentication, authorization, and managing user state effectively.

#### Explaination of how session token works:
The session token itself is not typically encrypted when transmitted in HTTP headers. However, it is highly recommended to use HTTPS (HTTP Secure) to encrypt the entire communication channel between the client and the server, including the session token and other sensitive data transmitted in headers or request/response bodies.

When using HTTP without encryption, the session token is sent in plain text over the network, making it vulnerable to interception and unauthorized access by attackers who can eavesdrop on the network traffic. This can lead to session hijacking attacks, where an attacker gains access to a user's session by stealing their session token.

On the other hand, when using HTTPS, the communication between the client and the server is encrypted using SSL/TLS (Secure Socket Layer/Transport Layer Security) protocols. HTTPS ensures that all data transmitted, including session tokens and other sensitive information, is encrypted and protected from unauthorized access.

When a client establishes an HTTPS connection with a server, the following occurs:

1. The client and server perform an SSL/TLS handshake to establish a secure connection.
2. The server sends its SSL/TLS certificate to the client for verification.
3. The client verifies the server's certificate and generates a shared secret key.
4. The client and server use the shared secret key to encrypt and decrypt the data transmitted between them.

By using HTTPS, the session token and all other data exchanged between the client and server are encrypted, making it much more difficult for attackers to intercept and steal sensitive information.

It's important to note that while HTTPS encrypts the communication channel, it does not encrypt the session token itself. The session token is still transmitted as plain text within the encrypted HTTPS connection. Therefore, it's crucial to use secure session management practices, such as generating random and unique session tokens, setting appropriate expiration times, and properly invalidating sessions when necessary.

In summary, session tokens themselves are not typically encrypted, but it is essential to use HTTPS to encrypt the entire communication channel and protect the session token and other sensitive data from unauthorized access during transmission.

#### Example of a cookie
A cookie is a small piece of data stored by a website on a user's browser. It consists of several components that define its properties and behavior. The structure of a cookie includes the following elements:

1. Name:
   - Every cookie has a unique name that identifies it.
   - The name is a case-sensitive string that follows certain rules, such as not containing whitespace, semicolons, or commas.
   - Example: `sessionToken`, `userId`, `preferences`.

2. Value:
   - The value is the actual data stored in the cookie.
   - It is a string that can contain text, numbers, or any other data.
   - The value is usually encoded using URL encoding to handle special characters.
   - Example: `abc123`, `John`, `%7B%22theme%22%3A%22dark%22%7D` (URL-encoded JSON).

3. Expiration/Max-Age:
   - Cookies can have an expiration time or a maximum age that determines how long they should be stored by the browser.
   - The expiration time is set using the `Expires` attribute, which specifies an absolute date and time.
   - The maximum age is set using the `Max-Age` attribute, which specifies the number of seconds until the cookie expires.
   - If neither `Expires` nor `Max-Age` is set, the cookie becomes a session cookie and is deleted when the browser is closed.
   - Example: `Expires=Fri, 31 Dec 2023 23:59:59 GMT`, `Max-Age=3600` (1 hour).

4. Domain:
   - The domain attribute specifies the domain or subdomain for which the cookie is valid.
   - By default, a cookie is associated with the domain that set it and is sent back to that domain on subsequent requests.
   - The domain can be set to a specific subdomain or a parent domain to allow the cookie to be accessed by multiple subdomains.
   - Example: `Domain=example.com`, `Domain=subdomain.example.com`.

5. Path:
   - The path attribute specifies the URL path for which the cookie is valid.
   - By default, a cookie is associated with the path of the page that set it and is sent back to that path and its sub-paths on subsequent requests.
   - The path can be set to a specific directory or a higher-level directory to limit or expand the scope of the cookie.
   - Example: `Path=/`, `Path=/subdirectory`.

6. Secure:
   - The `Secure` attribute is a boolean flag that indicates whether the cookie should only be transmitted over a secure HTTPS connection.
   - When the `Secure` attribute is set, the cookie will not be sent over unencrypted HTTP connections.
   - Example: `Secure` (no value needed).

7. HttpOnly:
   - The `HttpOnly` attribute is a boolean flag that prevents client-side JavaScript from accessing the cookie.
   - When the `HttpOnly` attribute is set, the cookie cannot be read or manipulated using JavaScript, providing an additional layer of security against cross-site scripting (XSS) attacks.
   - Example: `HttpOnly` (no value needed).

Here's an example of a cookie string that includes various attributes:

```
sessionToken=abc123; Expires=Fri, 31 Dec 2023 23:59:59 GMT; Path=/; Domain=example.com; Secure; HttpOnly
```

In this example, the cookie has a name of `sessionToken`, a value of `abc123`, an expiration date, a path of `/`, a domain of `example.com`, and the `Secure` and `HttpOnly` flags set.

Cookies are set by the server using the `Set-Cookie` header in the HTTP response, and the browser includes the relevant cookies in subsequent requests to the server using the `Cookie` header.