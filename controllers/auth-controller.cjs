"use strict";

const crypto = require("crypto");
const Boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");
const User = require("../models/user.cjs");
const { API_PREFIX } = require("../constants/route.cjs");

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

// Forgot password
exports.forgotPassword = async (req, h) => {
  // console.log(req.server.info);

  try {
    const user = await User.findOne({
      email: req.payload.email,
    });

    if (!user) {
      return Boom.boomify(new Error("User not found! Please try again."), {
        statusCode: 404,
      });
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    return h.response({
      message: "Successs",
      resetUrl: `${req.server.info.protocol}://${req.server.info.host}:${req.server.info.port}${API_PREFIX}/resetPassword/${resetToken}`,
    });
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("Can't change password!", { error: err });
  }
};

// Reset user's password
exports.resetPassword = async (req, h) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return Boom.boomify(
        new Error("Token is invalid or has expired! Please try again later."),
        { statusCode: 400 }
      );
    }

    // Update the password in the database
    user.password = req.payload.password;
    user.passwordConfirm = req.payload.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return createSendToken(user, 200, h);
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("There is something wrong!", { error: err });
  }
};

exports.updatePassword = async (req, h) => {
  try {
    // Get the user that want to update the password
    const user = await User.findById(req.params.id).select("+password");

    if (!user) {
      throw Boom.boomify(
        new Error("Couldn't find the current user! Try again later."),
        { statusCode: 404 }
      );
    }

    // Check if the currentPassword input from user is match with the password in the database
    if (!user.correctPassword(req.payload.password, user.password)) {
      return Boom.boomify(
        new Error("Your current password is incorrect! Please try again."),
        {
          statusCode: 401,
        }
      );
    }

    // If the current password is correct, let the user change the password
    user.password = req.payload.password;
    user.passwordConfirm = req.payload.passwordConfirm;

    await user.save();

    return createSendToken(user, 200, h);
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("There is something wrong!", { error: err });
  }
};
