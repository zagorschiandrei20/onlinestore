const express = require('express');
const passport = require('passport');
const router = express.Router();

const getUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).send("User not authenticated");
  }

  res.json({
    name: req.user.displayName,
    email: req.user.emails[0].value,
    userId: req.user.googleId,
  });
};


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", 
  passport.authenticate("google", { failureRedirect: "/auth/failure" }), 
  (req, res) => {
    const userData = req.user;  
    res.redirect(`http://localhost:3000/?user=${encodeURIComponent(JSON.stringify(userData))}`);
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.send("Error logging out");
    }

    res.redirect("http://localhost:3000");
  });
});

router.get("/profile", getUserProfile);

module.exports = router;