# MySchoolServer
MySchoolServer is the REST Api for the MySchool project. This project is a platform (website) designed for a school on which applicants can submit applications, parents can view the grades of their children, teachers can submit assignments and many more.

## How to run
- Download the MySchoolServer from this repositoty.
- Open the terminal and navigate to the directory in which you just downloaded the MySchoolServer.
- run `npm install`
- run `npm start`

### Before you run

#### MongoDB
This service uses MongoDB v7.0.14, at the time of its creation, for a database. Please ensure you have MongoDB installed before starting the server.
#### Node.js
Node.js v22.11.0 is the runtime environment on which this server was made.
#### Server settings
The server has a file with settings `serverConfig.js` in which different variables are set. The default port number is set to `3000` and the default allowed domains for CORS are `['http://localhost:5555', 'http://localhost:4200']`. MySchoolApp client app runs by default on `http://localhost:4200` and sends to `http://localhost:3000`. If any of this is changes on one side, appropriate settings must be set on the other side also.

If you do not have a `.env` file the defaults are used. You can see all of them in `serverConfig.js`, located in `/src/config`.

## Functionality
### Authentication
For authentication a JSON Web Token is used to store the user ID and status and is sent and stored on the client side in the form of a cookie.
### File storage
Each uploaded file is stored in the `storage` folder in the root of the project. Its name is made unique with the help of the `uuid` package. For each file a separate document `File` is created in the DB, which includes the original name, the absolute file path to the file, MIME type and more.
### Default profile picture
If a user does not upload a profile picture on registration/application (only for students) the server assigns the default picture, found in the `assets` folder in the root. When an application is reviewed and rejected by a teacher all files associated with it are also deleted from the DB and the system. The only exeption is when the user has the default picture set. In this case only the `File` document from the DB is deleted.
