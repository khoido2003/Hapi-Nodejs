const { API_PREFIX } = require("../constants/route.cjs");
const { restrictTo } = require("../controllers/auth-controller.cjs");
const {
  getAllReviews,
  createReview,
  setTourUserIds,
  getReview,
  updateReview,
  deleteReview,
} = require("../controllers/review.cjs");

exports.reviewRoutes = [
  // Find all reviews
  {
    method: "GET",
    path: `${API_PREFIX}/reviews`,
    handler: getAllReviews,
  },

  // Create new review
  {
    method: "POST",
    path: `${API_PREFIX}/reviews`,
    handler: createReview,
    options: {
      pre: [restrictTo("user", "admin"), setTourUserIds],
    },
  },

  // Get a review by ID
  {
    method: "GET",
    path: `${API_PREFIX}/reviews/{id}`,
    handler: getReview,
  },

  // Update a review by ID
  {
    method: "PATCH",
    path: `${API_PREFIX}/reviews/{id}`,
    handler: updateReview,
    options: {
      pre: [restrictTo("user", "admin")],
    },
  },

  // Delete a review by ID
  {
    method: "DELETE",
    path: `${API_PREFIX}/reviews/{id}`,
    handler: deleteReview,
    options: {
      pre: [restrictTo("user", "admin")],
    },
  },
];
