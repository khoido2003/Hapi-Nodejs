"use strict";

const { getAllTours } = require("../controllers/tour.cjs");

const tourRoutes = [
  {
    method: "GET",
    path: "/api/v1/tours",
    handler: (req, h) => {
      const tours = getAllTours();
      return tours;
    },
  },

  {
    method: "POST",
    path: "/api/v1/tours",
    handler: (req, h) => {
      return "Hello World";
    },
  },

  {
    method: "GET",
    path: "/api/v1/top-5-tour",
    handler: (req, h) => {
      return "Hello World";
    },
  },
];

module.exports = tourRoutes;
