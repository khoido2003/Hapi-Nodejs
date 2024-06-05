"use strict";

const Boom = require("@hapi/boom");

const Tour = require("../models/tour.cjs");

exports.getAllTours = () => {
  try {
    const tours = Tour.find({});
    return tours;
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("Can't find tours! Try again later");
  }
};
