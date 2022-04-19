const User = require("../Module/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.userSignup = async (req, res) => {
  try {
    const useremail = await User.findOne({ email: req.body.email });

    if (useremail == null && !useremail) {
      const userObj = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      userObj
        .save()
        .then((response) => {
          res.json({ user: response, messege: "user signup succcessful" });
        })
        .catch((response) => {
          res.json({ user: response, messege: " user signup error" });
        });
    } else {
      res.json({ messege: "user alredy exits" });
    }
  } catch {
    console.log("userSignup error");
  }
};
exports.userLogin = async (req, res) => {
  const login = await User.findOne({ email: req.body.email });
  console.log(req.body);
  if (login === null || 0) {
    res.json({ messege: "user not exits" });
  } else if (login !== null) {
    if (req.body.password) {
      const userdata = await bcrypt.compare(req.body.password, login.password);
      if (userdata) {
        const token = jwt.sign(
          { name: login.name, id: login._id },
          process.env.SECRET_KEY
        );
        res.status(200).json({ auth: userdata, token: token });
      } else if (!userdata || userdata === false) {
        res.json({ messege: " invalid detail" });
      }
    } else {
      res.json({ messege: "plz provide password" });
    }
  }
};
