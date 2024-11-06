import express from "express";
const app = express();
const port = 3000;

import morgan from "morgan";
import fs from "fs";

// Application level middleware must always come first before your route definitions
/*
    We use the next() to allow users to access our page using the middleware, 
    But with the middleware we can restrict users from accessing our application by 
    simply adding the conditions we assign the app.send() as the error message to the 
    restricted users
*/

// USING A THIRD PARTY NODE MODULE AS APPLICATION LEVEL MIDDLEWARE
// We use this to get details of the user device and time splent to run
app.use(morgan("dev"));

// USING BUILT IN EXPRESS MIDDLEWARE

app.use(express.json());

// USING THE EXPRESS.STATIC TO CAUSE EXTERNAL LINKS IN YOUR HTML TO RUN

app.use(express.static("public"));

// EXPRESS APPLICATION LEVEL MIDDLEWARE
app.use((req, res, next) => {
  const date = new Date();
  console.log(date);
  console.log(req.url);

  let time = 14;
  if (time < 20) {
    return next();
  }

  res.send("<h1>SORRY YOU CAN NOT ACCESS THE PAGE AT THE MOMENT</h1>");
});

// Defining your routes
app.get("/", (req, res) => {
  // testing out error handling middleware with a fake user instance that does not exist
  // console.log(user);
  const getContent = fs.readFileSync("public/about.html", "utf-8");
  console.log(getContent);
  console.log(req);
  res.status(200).send(getContent);
});

app.get("/register", (req, res) => {
  console.log(req.body);

  res.status(201).json({
    user_name: "MariusX",
    prog_language: "JavaScript",
    about: {
      place_of_birth: "Sokoto",
      state_of_origin: "Enugu",
    },
  });
});

app.get("/about", (req, res) => {
  const getContent = fs.readFileSync("public/about.html", "utf-8");
  console.log(getContent);
  res.send(getContent);
});

app.get(
  "/admin",
  (req, res, next) => {
    let userType = "user";
    if (userType === "admin") {
      return next();
    }
    res.send("You do not have access");
  },
  (req, res) => {
    res.send("<h1>Welcome Admin</h1>");
  }
);

app.get("/login", (req, res) => {
  res.send("Login Successful.");
});

// THE ERROR HANDLING MIDDLEWARE COMES AFTER ALL ROUTES HAS BEEN DECLARED

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Sorry an internal server error occurred");
});

// After creating routs you need to listen for requests sent (server request)

app.listen(port, () => {
  console.log("Server started, listening for request");
});
