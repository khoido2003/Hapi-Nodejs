"use strict";

const { reviewRoutes } = require("./review.cjs");
const tourRoutes = require("./tour.cjs");
const userRoutes = require("./user.cjs");

const routes = [].concat(tourRoutes, userRoutes, reviewRoutes);

module.exports = routes;
