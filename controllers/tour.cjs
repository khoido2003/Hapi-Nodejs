"use strict";

const Boom = require("@hapi/boom");

const Tour = require("../models/tour.cjs");
const APIFeatures = require("../utils/apiFeatures.cjs");

exports.getAllTours = async (req, h) => {
  // console.log(req.auth.credentials);

  try {
    let filter = {};

    const features = new APIFeatures(Tour.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    // const tours = await Tour.find({});
    return h.response(tours).code(200);
  } catch (err) {
    // console.log(err);
    throw Boom.badImplementation("Can't find tours! Try again later", {
      error: err,
    });
  }
};

exports.createTour = async (req, h) => {
  try {
    const newTour = await Tour.create(req.payload);

    return h.response(newTour.toObject()).code(201);
  } catch (err) {
    // console.log(err);

    throw Boom.badImplementation("Can't create new tour!", { error: err });
  }
};
