require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const db = require("./models");

require("./auth/googleAuth"); 
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true })); 
app.use(express.json());
app.use("/cart", require("./routes/cart"));


app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key", 
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/products", require("./routes/products"));
app.use("/auth", authRoutes); 

app.get("/", (req, res) => {
  res.send("Backend Server Running with Google OAuth!");
});

const PORT = process.env.PORT || 5000;
db.sequelize.sync().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
});