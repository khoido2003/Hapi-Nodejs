const Boom = require("@hapi/boom");
const User = require("../models/user.cjs");

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
