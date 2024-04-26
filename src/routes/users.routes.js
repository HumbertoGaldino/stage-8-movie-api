const { Router } = require("express");

const UserController = require("../controllers/UsersController");
const ValidateEmail = require('../utils/ValidateEmail')
const AppError = require('../utils/AppError')

const userRoutes = Router();


function middlewareValidateEmail(request, response, next) {
  const { email } = request.body
  if (!email) {
    throw new AppError(`The email is required!`,401)
  }
  if (!ValidateEmail(email)) {
    throw new AppError(`The email ${email} is not a valid email!`,401)
  }
  next()

}

const userController = new UserController()



userRoutes.post("/", middlewareValidateEmail, userController.create)
userRoutes.put("/:id", middlewareValidateEmail,userController.update)
userRoutes.get("/:user_id", userController.show)
userRoutes.delete("/:id", userController.drop)
userRoutes.get("/", userController.index)


module.exports = userRoutes