"use strict";

const Boom = require("@hapi/boom");

const jwt = require("jsonwebtoken");
const User = require("../models/user.cjs");

const signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const createSendToken = (user, statusCode, h) => {
  const token = signToken(user);

  const cookieOptions = {
    ttl: process.env.JWT_COOKIE_EXPIRES_IN * 1 * 24 * 60 * 60 * 1000,
    isSecure: process.env.NODE_ENV === "production",
    isHttpOnly: true,
  };

  return h
    .response({
      message: "Success",
      token,
      data: { user },
    })
    .state("jwt_cookie", token, cookieOptions)
    .code(statusCode);
};

exports.signUp = async (req, h) => {
  try {
    const { name, email, password, passwordConfirm } = req.payload;

    if (!name || !email || !password || !passwordConfirm) {
      return h
        .response({
          message: "Please enter all the required information!",
        })
        .code(500);
    }

    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      passwordChangedAt: Date.now(),
    });

    return createSendToken(newUser, 201, h);
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("Something went wrong!", {
      error: err,
    });
  }
};

exports.login = async (req, h) => {
  try {
    const { email, password } = req.payload;

    if (!email || !password) {
      return Boom.boomify(new Error("Please enter your email and password!"), {
        statusCode: 400,
      });
    }

    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return Boom.boomify(new Error("Incorrect password or email!"), {
        statusCode: 401,
      });
    }

    return createSendToken(user, 200, h);
  } catch (err) {
    console.log(err);

    throw Boom.badImplementation("Something went wrong!", {
      error: err,
    });
  }
};

exports.logout = (req, h) => {
  try {
    h.unstate("jwt_cookie", {
      isHttpOnly: true,
      isSecure: process.env.NODE_ENV === "production",
    });

    return h
      .response({
        message: "Success",
      })
      .code(200);
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("Something went wrong!", {
      error: err,
    });
  }
};

// Authorization based on role
exports.restrictTo =
  (...roles) =>
  (req, h) => {
    console.log();
    if (!roles.includes(req.auth.credentials.user.role)) {
      throw Boom.forbidden(
        "You do not have permission to access this resource"
      );
    }
    return h.continue;
  };
