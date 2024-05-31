import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";
import GoogleStrategy from "passport-google-oauth2" //google auth
import connectDB from './public/js/db.js'
import User from './public/js/user.js';
import Razorpay from 'razorpay';
import Driver from './public/js/driver.js';
import Volunteer from './public/js/vol.js';

//===========PORT and SALT ROUNDS FOR HASHING and DB CONNECT ============================================================
const port = 3000;
const app = express();
const saltRounds = 10;
env.config();
connectDB();
//===========PORT and SALT ROUNDS FOR HASHING and DB CONNECT ============================================================

//====================MIDDLEWARE============================================================================
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
//====================MIDDLEWARE============================================================================

//========================HANDLE SESSIONS==============================================================
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge:1000 //1000 SECOND length cookie
  }
}))
//========================HANDLE SESSIONS==============================================================

//========================INITIALIZE PASSPORT FOR AUTHRNTIFICATION==============================================================
app.use(passport.initialize());
app.use(passport.session())
//========================INITIALIZE PASSPORT FOR AUTHRNTIFICATION===========================================================

//===========================================GET ROUTES======================================================================
app.get("/", (req,res)=>{
    res.render("index.ejs");

})
app.get("/signup_user", (req,res)=>{
    res.render("user_signup.ejs")
})
app.get("/login_user", (req,res)=>{
    res.render("user_login.ejs")
})
app.get("/signup_driver", (req,res)=>{
    res.render("driver_signup.ejs")
})
app.get("/login_driver", (req,res)=>{
    res.render("driver_login.ejs")
})
app.get("/signup_volunteer", (req,res)=>{
    res.render("vol_signup.ejs")
})
app.get("/login_vol", (req,res)=>{
    res.render("vol_login.ejs")
})
app.get("/career", (req,res)=>{
  res.render("career.ejs");
})
//interface for driver after passenger books ride
app.get("/inter", (req,res)=>{
  res.render("inter.ejs")
})
//interface for volunteer to accept or reject ride
app.get("/inter2", (req,res)=>{
  res.render("inter2.ejs")
})

//forms for information retrieval
app.get("/forms", (req,res)=>{
  res.render("forms.ejs")
})
app.get("/forms2", (req,res)=>{
  res.render("forms2.ejs")
})

//face recognition page
app.get("/faceID", (req,res)=>{
  res.render("face_recog.ejs")
})
//book cab page with map
app.get("/book_cab", (req,res)=>{
    res.render("book_cab.ejs")
})

//driver account test render
app.get("/drive_acc", (req,res)=>{
  res.render("acc_driv.ejs")
})
//volunteer account page - test render
app.get("/vol_acc", (req,res)=>{
  res.render("acc_vol.ejs")
})

//Route handler for Driver Auth
app.get('/drive_acc', (req, res) => {

  if (!req.session.driver) {
      return res.redirect('/login_driver'); // Redirect to login page if not authenticated
  }
  res.render('acc_driv.ejs', { driver: req.session.driver });
});

//Authenticate user
app.get("/account", (req,res)=>{
  console.log(req.user);
  if(req.isAuthenticated()){
    
    res.render("acc.ejs", { user: req.user });
  }else{
    res.redirect("/login_user")
  }
})
//get route for google authentification with passport
app.get("/auth/google", passport.authenticate("google", {
  scope:["profile", "email"],

}))
app.get("/auth/google/secrets", passport.authenticate("google", {
  successRedirect:"/account",
  failureRedirect: "/login_user"
}))

//to redirect to home when logging out
app.get("/logout", (req,res)=>{
  req.logout((err)=>{
    if (err) console.log(err)
    res.redirect("/")
  })
})

//get route to user account after face detection
app.get("/acc_for_face", (req, res) => {
  
  console.log("acc_for_face route handler called");
  const userName = req.query.userName;
  console.log(userName);
  if (userName) {
    // Render the template with the userName variable
    res.render("acc.ejs", { user: userName });
  } else {
    // Send an error response or handle the situation accordingly
    res.render("acc.ejs", { user: "Alan Saji" });
  }

});
//interface when waiting for taxi
app.get("/user_inter",(req,res) =>{
 res.render("user_inter.ejs")
})
//payment process middle page
app.get("/payment", (req,res)=>{
  res.render("payment.ejs")
})
// Route handler to serve Volunteer account page
app.get('/vol_acc', (req, res) => {
  
  if (!req.session.vol) {
      return res.redirect('/login_vol'); 
  }
  console.log(req.session.vol);
  res.render('acc_vol.ejs', { vol: req.session.vol });
});

//===========================================GET ROUTES======================================================================




//==========================================POST ROUTES======================================================================
// app.post("/login_driver", passport.authenticate("local", {
//   successRedirect:"/drive_acc",
//   failureRedirect: "/login_driver"
// }))
// app.post("/login_vol", passport.authenticate("local", {
//   successRedirect:"/vol_acc",
//   failureRedirect: "/login_vol"
// }))

// Route handler for driver login
app.post('/login_driver', async (req, res) => {
  try {
      // Extract login information from request body
      const { email, password } = req.body;

      // Find the driver by email
      const driver = await Driver.findOne({ email });
      if (!driver) {
          return res.status(401).json({ message: 'Invalid email' });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, driver.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Store driver information in the session
      req.session.driver = {
          id: driver._id,
          email: driver.email,
          firstName: driver.firstName,
          lastName: driver.lastName
      };

      // Redirect to driver account page or send success response
      res.redirect('/drive_acc');
  } catch (error) {
      // Handle errors
      console.error('Error in driver login:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Route handler for driver signup
app.post('/signup_driver', async (req, res) => {
  try {
      // Extract signup information from request body
      const { email, firstName, lastName, password } = req.body;

      // Check if the email is already registered
      const existingDriver = await Driver.findOne({ email });
      if (existingDriver) {
          return res.status(400).json({ message: 'Email is already registered' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new driver instance
      const newDriver = new Driver({
          email,
          firstName,
          lastName,
          password: hashedPassword // Store the hashed password
      });

      // Save the driver to the database
      await newDriver.save();

      // Return success response
      res.redirect("/drive_acc");
      // res.status(201).json({ message: 'Driver signed up successfully' });
      
  } catch (error) {
      // Handle errors
      console.error('Error in driver signup:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});



//payment with razorpay ==================================================================================

const instance = new Razorpay({
  key_id: 'rzp_test_9wbgKGqZ4eqQ3L',
  key_secret: 'Io8I1o8ZJQO7KXxi52In8Gyh'
});

app.post("/create-order", (req, res) => {
  const amount = req.body.amount;

  // Create order with Razorpay
  const options = {
      amount: amount, // amount in the smallest currency unit
      currency: 'INR',
      receipt: 'order_rcptid_11'
  };

  instance.orders.create(options, function(err, order) {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      console.log(order);
      res.json({ orderId: order.id });
  });
});
//payment with razorpay ==================================================================================

//face-detection for user=================================================================================
app.post('/acc-for-face', (req, res) => {
  const name = req.body.userName;
  console.log(name);
  if (name === "Alan") {
    
      res.json({ redirectUrl: '/acc_for_face', userName: name }); // Include userName in the response
  
    // Redirect to '/acc_for_face' route
     
  } else {
    res.json({ success: false, message: "unidentified" }); // Respond with JSON
  }
});
//face-detection for user=================================================================================



app.post("/signup_user", async (req, res) => {
  const phone = req.body.phoneNo;
  const pass = req.body.password;
  const fname = req.body.firstName;
  const lname = req.body.lastName;
  const email = req.body.email;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(pass, saltRounds);

    // Check if the user already exists
    const existingUser = await User.findOne({ phone: phone });
    if (existingUser) {
      return res.send("Phone Number already registered");
    }

    // Create a new user document
    const newUser = new User({
      email: email,
      firstName: fname,
      lastName: lname,
      phone: phone,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    console.log('User created:', newUser);

    // Redirect to account page or any other page as needed
    res.redirect("/account");
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send("Error creating user");
  }
});


app.post("/login_user", passport.authenticate("local", {
  successRedirect:"/account",
  failureRedirect: "/login_user"
}))

passport.use("local", new Strategy(async function verify(username, password, cb) {
  try {
    const user = await User.findOne({ phone: username });
    if (user) {
      // User found, now check the password
      console.log("user found");
      bcrypt.compare(password, user.password, (err, result) => {
        console.log(result);
        if (err) {
          console.log("error 1");
          return cb(err);
        } else {
          if (result) {
            console.log("reached here");
            return cb(null, user);
          } else {
            console.log("reached here tooo");
            return cb(null, false);
          }
        }
      });
    } else {
      console.log("reached here tooo man");
      return cb(null, false, { message: "The Phone Number provided is not registered, please register" });
    }
  } catch (error) {
    console.log("reached here tooo man yo");
    return cb(error);
  }
}));

passport.use("google", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
}, async(accessToken, refreshToken, profile, cb) => {
  try {
    
    // Check if the user exists in the database
    const user = await User.findOne({ email: profile.email });
    if (!user) {
      // User does not exist, create a new user
      const newUser = await User.create({
        email: profile.email,
        password: "google" 
      });
      return cb(null, newUser);
    } else {
      // User exists, return the user
      return cb(null, user);
    }
  } catch (err) {
    return cb(err);
  }
}));

passport.serializeUser((user, cb)=>{
  cb(null, user);
})

passport.deserializeUser((user, cb)=>{
  cb(null, user);
})

// Add a route to handle volunteer signup POST request
app.post("/signup_volunteer", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  try {
      // Check if the user already exists
      const hashedPassword = await bcrypt.hash(password, saltRounds); 
      const existingUser = await Volunteer.findOne({ email: email });
      if (existingUser) {
          return res.send("Volunteer already exists");
      }

      // Create a new user document
      const newUser = new Volunteer({
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: hashedPassword,
      });

      // Save the new user to the database
      await newUser.save();

      console.log('Volunteer created:', newUser);

      // Redirect to account page or any other page as needed
      res.redirect("/vol_acc");
  } catch (error) {
      console.error('Error creating volunteer:', error);
      res.status(500).send("Error creating volunteer");
  }
});
app.post('/login_vol', async (req, res) => {
  try {
      // Extract login information from request body
      const { email, password } = req.body;

      // Find the driver by email
      const vol = await Volunteer.findOne({ email });
      if (!vol) {
          return res.status(401).json({ message: 'Invalid email' });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, vol.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Store driver information in the session
      req.session.driver = {
          id: vol._id,
          email: vol.email,
          firstName: vol.firstName,
          lastName: vol.lastName
      };

      // Redirect to driver account page or send success response
      res.redirect('/vol_acc');
  } catch (error) {
      // Handle errors
      console.error('Error in volunteer login:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

//=====================================LISTEN================================================

app.listen(port, ()=>{
  console.log(`Server running on port ${port}`);
})


// @aditya-s-nair


// @MansaaNarang


// @Mehak13A
