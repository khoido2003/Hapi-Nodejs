"use strict";

const tourRoutes = require("./tour.cjs");
const userRoutes = require("./user.cjs");

const routes = [].concat(tourRoutes, userRoutes);

module.exports = routes;
