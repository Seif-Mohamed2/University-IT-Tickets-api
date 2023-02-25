University-IT-Tickets-api is a backend service designed using Nodejs, Express, and MongoDB. The main purpose of the api is to provide REST operations for three different database models created and saved with MongoDB. The api implements jsonwebtoken to verify login and give authentication to users. This api was used to provide the backend for the full website designed with Reactjs. <br/>
You can visit the application through the following url: https://university-it-tickets.onrender.com

<br/>
<h2>Folders and files in the project</h2>
Index.js: the main file that connects to MongoDB and directs each request to the requested route. 


Package.json&Package-lock.json: are files listing the dependencies and other commands for node. Their content is going to be needed to install node modules. 

.gitignore: git file that include file names not to be included in the repository. 

Config folder: include three files that specifies the allowed origins to access the api and the code to connect to MongoDB database. 

Controllers folder: contains 4 files:
usersController, studentsController, ticketsController: each with CRUD api operations for each data model. 4th file is authController to handle authorization and authentication when user requests to login and logout. 

Middleware folder: has 4 files to handle and log errors, verify login tokens, and limit login attempts from the same ip address. 

Models folder: includes 3 files with 3 MongoDB models: users, students, tickets.

Public folder: includes CSS to make simple design for main and error pages requests. 

Routes folder: contains the routes specified and associated with each path. 

Views: includes HTML pages. 

<h2>Simple explanation </h2>
This application is meant to be part of the full-stack MERN stack website, University-IT-Tickets. The api provides the necessary functionality to the website by providing: 

1- CRUD operations for models to provide the front-end with the tools used to query and manipulate mongoDB databases.  
2- Login and logout options for employees and students. Once a user is logged in the data provided from their login cookie helps the front-end app to decide which information can be provided to this user. The login cookie has the user’s username, student or employee, and if employee whether they are managers or not. 

<h2>How to run </h2>
First of all there is some additional data you have to provide if you want to run this application on your own computer. The application needs three environment variables:

DATABASE_URI: this is the link provided by mongoDB to access the data of your models. 
ACCESS_TOKEN_SECRET: access token provided by json web token
REFRESH_TOKEN_SECRET:  refresh token provided by json web token

After you provide these data you can simply start npm:

```powershell
npm start
```
