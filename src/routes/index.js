const { Router } = require("express");

const usersRouter = require("./users.routes");
const movieNotesRouter = require("./moviesNotes.routes");
const tagsRouter = require("./tags.routes");
const sessionsRouter = require("./sessions.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/notes", movieNotesRouter);
routes.use("/tags", tagsRouter);

module.exports = routes;
