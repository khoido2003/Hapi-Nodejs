"use strict";

const Boom = require("@hapi/boom");

const Tour = require("../models/tour.cjs");
const APIFeatures = require("../utils/apiFeatures.cjs");

// Get top 5 tours
exports.topToursAlias = (req, h) => {
  req.query.limit = "5";
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingAverage,summary,difficulty";

  return h.continue;
};

// Get all tours
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
    return h
      .response({
        status: "success",
        results: tours.length,
        tours,
      })
      .code(200);
  } catch (err) {
    console.log(err);

    throw Boom.badImplementation("Can't find tours! Try again later", {
      error: err,
    });
  }
};

// Create a new tour
exports.createTour = async (req, h) => {
  try {
    const newTour = await Tour.create(req.payload);

    return h
      .response({
        status: "success",
        tour: newTour.toObject(),
      })
      .code(201);
  } catch (err) {
    console.log(err);

    throw Boom.badImplementation("Can't create new tour!", { error: err });
  }
};

// Get a single tour
exports.getTour = async (req, h) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return Boom.boomify(
        new Error("Can't find tour with that ID. Please try again!"),
        {
          statusCode: 404,
        }
      );
    }

    return h
      .response({
        status: "success",
        tour,
      })
      .code(200);
  } catch (err) {
    console.log(err);

    throw Boom.badImplementation("Can't get tour!", { error: err });
  }
};

// Delete a tour
exports.deleteTour = async (req, h) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return Boom.boomify(
        new Error("Can't find tour with that ID. Please try again!"),
        {
          statusCode: 404,
        }
      );
    }

    return h
      .response({
        status: "Success",
        data: null,
      })
      .code(204);
  } catch (err) {
    console.log(err);

    // Message is stored in req.response
    throw Boom.badImplementation("Can't delete tour!", { error: err });
  }
};

// Update a tour
exports.updateTour = async (req, h) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.payload, {
      new: true, // Return the new updated tour
      runValidators: true, // Run all validators before save the document to the database
    });

    if (!tour) {
      return Boom.boomify(
        new Error("Can't find tour with that ID. Please try again!"),
        {
          statusCode: 404,
        }
      );
    }

    return h
      .response({
        status: "success",
        tour,
      })
      .code(200);
  } catch (err) {
    console.log(err);

    // Message is stored in req.response
    throw Boom.badImplementation("Can't update tour!", { error: err });
  }
};

// Get tour statistics from aggregation
exports.getTourStats = async (req, h) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingAverage: {
            $gte: 4.5,
          },
        },
      },

      {
        $group: {
          // Group key set with _id
          _id: {
            $toUpper: "$difficulty",
          },
          numTour: { $sum: 1 },
          numRatings: { $sum: "$ratingQuantity" },
          avgRatings: { $avg: "$ratingAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },

      {
        $sort: {
          avgPrice: 1,
        },
      },
    ]);

    return h
      .response({
        status: "success",
        results: stats.length,
        data: {
          stats,
        },
      })
      .code(200);
  } catch (err) {
    console.log(err);

    throw Boom.badImplementation("There is something wrong!", { error: err });
  }
};

// Get monthly plans
exports.getMonthlyPlans = async (req, h) => {
  try {
    const year = +req.params.year;

    const plan = await Tour.aggregate([
      // Extract an array
      {
        $unwind: "$startDates",
      },

      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      {
        $group: {
          _id: {
            $month: "$startDates",
          },
          numTourStarts: {
            $sum: 1,
          },
          tours: {
            $push: "$name",
          },
        },
      },

      // Add an additional field
      {
        $addFields: {
          month: "$_id",
        },
      },

      // Include or exclude return fields
      {
        $project: {
          _id: 0,
        },
      },

      {
        $sort: {
          numTourStarts: -1,
        },
      },

      {
        $limit: 12,
      },
    ]);

    return h
      .response({
        status: "success",
        results: plan.length,
        plan,
      })
      .code(200);
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("There is something wrong!", { error: err });
  }
};
