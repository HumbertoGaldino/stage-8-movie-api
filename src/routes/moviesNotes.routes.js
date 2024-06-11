const { Router } = require("express");
const MoviesNotesController = require("../controllers/MoviesNotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const moviesNotesRoute = Router();

const moviesNotesController = new MoviesNotesController();

moviesNotesRoute.use(ensureAuthenticated);

moviesNotesRoute.post("/:user_id", moviesNotesController.create);
moviesNotesRoute.get("/:id", moviesNotesController.show);
moviesNotesRoute.get("/", moviesNotesController.index);
moviesNotesRoute.delete("/:id", moviesNotesController.delete);

module.exports = moviesNotesRoute;
