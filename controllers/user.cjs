const Boom = require("@hapi/boom");
const User = require("../models/user.cjs");
const { filterObj } = require("../utils/utils-fn.cjs");

exports.getAllUsers = async (req, h) => {
  try {
    const users = await User.find({});

    return h
      .response({
        status: "success",
        data: { users },
      })
      .code(200);
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("Can't get all users!", { error: err });
  }
};

exports.getMe = async (req, h) => {
  try {
    const user = await User.findById(req.auth.credentials.user.id);
    if (!user) {
      return Boom.boomify(new Error("Can't get your infomation"), {
        statusCode: 404,
      });
    }
    return h.response({
      status: "success",
      user,
    });
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("Can't get your information!", { error: err });
  }
};

// Update user information: name, email, picture
exports.updateMe = async (req, h) => {
  console.log(req.auth.credentials);

  try {
    // Not allow update user update the password in this route
    if (req.payload.password || req.payload.passwordConfirm) {
      return Boom.boomify(
        new Error(
          "This route is not for update password. Please use /updatePassword instead."
        )
      );
    }

    // Only allow user update email and name
    const filteredBody = filterObj(req.payload, "name", "email");

    const updateUser = await User.findByIdAndUpdate(
      req.auth.credentials.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    return h
      .response({
        status: "success",
        user: updateUser,
      })
      .code(200);
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("There is something wrong!", { error: err });
  }
};

// Delete current account
exports.deleteMe = async (req, h) => {
  try {
    // Not actually delete the account out of the database but just change the active attribute to false so when find that account it can not be found
    const user = await User.findByIdAndUpdate(req.auth.credentials.id, {
      active: false,
    });

    if (!user) {
      return Boom.boomify(
        new Error("Your account is not existed! Please try again."),
        {
          statusCode: 404,
        }
      );
    }

    return h
      .response({
        status: "success",
        data: null,
      })
      .code(204);
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("There is something wrong!", { error: err });
  }
};
