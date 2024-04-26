const { Router } = require("express");

const userRoutes = require("./users.routes");
const moviesNotesRoutes = require("./moviesNotes.routes");

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/movieNotes", moviesNotesRoutes);

module.exports = routes;
