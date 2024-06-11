"use strict";

const { getAllTours, createTour } = require("../controllers/tour.cjs");

const tourRoutes = [
  {
    method: "GET",
    path: "/api/v1/tours",
    handler: getAllTours,
    options: {
      auth: {
        strategies: ["jwt-bearer", "jwt-cookie"],
      },
    },
  },

  {
    method: "POST",
    path: "/api/v1/tours",
    handler: createTour,
  },

  {
    method: "GET",
    path: "/api/v1/top-5-tours",
    handler: (req, h) => {
      return "Hello World";
    },
  },
];

module.exports = tourRoutes;
