const express = require("express");
const passport = require("passport");
const boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");
const api = express.Router();

const { config } = require("../../config");

// Basic strategy
require("../../utils/auth/strateggies/basic");

api.post("/token", async function (req, res, next) {
  passport.authenticate("basic", function (error, data) {
    try {
      req.login(data, { session: false }, async function (errorLogin) {
        const { user, email } = req.body;

        const payload = { sub: user, email: email };
        const token = jwt.sign(payload, config.authJwtSecret, {
          expiresIn: "15m",
        });

        return res.status(200).json({ access_token: token });
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

module.exports = api;
