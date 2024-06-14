const Boom = require("@hapi/boom");
const Review = require("../models/review.cjs");

// Handle case where the payload does not have tourID or userId key by taking it fromt the url params and the session
exports.setTourUserIds = async (req, h) => {
  if (!req.payload.tour) {
    req.payload.tour = req.params.id;
  }

  if (!req.payload.user) {
    req.payload.user = req.auth.credentials.user.id;
  }

  return h.continue;
};

// Get all reviews
exports.getAllReviews = async (req, h) => {
  try {
    const reviews = await Review.find({});

    if (!reviews) {
      return Boom.boomify(new Error("No reviews found!"), { statusCode: 404 });
    }

    return h
      .response({
        status: "success",
        results: reviews.length,
        reviews,
      })
      .code(200);
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("Something went wrong!", { error: err });
  }
};

// Find a review by Id
exports.getReview = async (req, h) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return Boom.boomify(
        new Error("Couldn't find review! Please try again later."),
        { statusCode: 404 }
      );
    }

    return h
      .response({
        status: "success",
        review,
      })
      .code(200);
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("Something went wrong!", { error: err });
  }
};

// Create a new review by ID
exports.createReview = async (req, h) => {
  try {
    const review = await Review.create(req.payload);

    return h
      .response({
        status: "success",
        review,
      })
      .code(201);
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("Something went wrong!", { error: err });
  }
};

// Update a review by ID
exports.updateReview = async (req, h) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.payload, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      return Boom.boomify(
        new Error("Couldn't find review! Please try again later."),
        { statusCode: 404 }
      );
    }

    return h
      .response({
        status: "success",
        review,
      })
      .code(200);
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("Something went wrong!", { error: err });
  }
};

// Delete a review by ID
exports.deleteReview = async (req, h) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return Boom.boomify(
        new Error("Couldn't find review! Please try again later."),
        { statusCode: 404 }
      );
    }

    return h
      .response({
        status: "success",
      })
      .code(204);
  } catch (err) {
    console.log(err);
    throw Boom.badImplementation("Something went wrong!", { error: err });
  }
};
