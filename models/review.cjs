const mongoose = require("mongoose");

const Tour = require("./tour.cjs");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can't be empty!"],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour!"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user!"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add index to fields
reviewSchema.index(
  {
    tour: 1,
    user: 1,
  },
  { unique: true }
);

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        numRatings: { $sum: 1 },
        avgRatings: { $avg: "$rating" },
      },
    },
  ]);

  console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingAverage: stats[0].avgRatings,
      ratingQuantity: stats[0].numRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingAverage: 4.5,
      ratingQuantity: 0,
    });
  }
};

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

// Find the current rewiew which being updated
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // make a copy of current query
  this.r = await this.clone().findOne();

  next();
});

// Update the rating when user update their review
reviewSchema.post(/^findOneAnd/, async function () {
  // Since query only executes once so we need to use the clone() so can able to execute the query again
  if (this.r) {
    // this.r: Document
    await this.r.constructor.calcAverageRatings(this.r.tour);
  }
});

// Update the rating when user create new review
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
