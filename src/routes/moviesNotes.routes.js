const { Router } = require("express")
const MoviesNotesController = require("../controllers/MoviesNotesController")


const moviesNotesRoute = Router();

const moviesNotesController = new MoviesNotesController()

moviesNotesRoute.post("/:user_id", moviesNotesController.create)
moviesNotesRoute.get("/:id", moviesNotesController.show)
moviesNotesRoute.get("/", moviesNotesController.index)




module.exports = moviesNotesRoute