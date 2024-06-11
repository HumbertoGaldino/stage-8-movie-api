const { hash, compare } = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;
    const database = await sqliteConnection();

    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE  email =(?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError(`The email ${email} is already in use`);
    }

    const hashedPasswords = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?,?,?)",
      [name, email, hashedPasswords]
    );

    return response.status(201).json({
      status: "SUCCESS",
      message: `The user ${name} has been created `,
    });
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [
      user_id,
    ]);

    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir a nova senha."
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      user.password = await hash(password, 8);
    }

    await database.run(
      `
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );

    return response.status(200).json();
  }

  async index(request, response) {
    const allSUers = await knex("users").select(
      "id",
      "name",
      "avatar",
      "email"
    );
    console.log(allSUers);
    response.status(201).json(allSUers);
  }

  async show(request, response) {
    const { user_id } = request.params;
    const user = await knex("users")
      .where({ id: user_id })
      .select("id", "name", "email", "avatar");
    console.log(user);
    response.status(201).json(user);
  }

  async drop(request, response) {
    const { id } = request.params;
    const user = await knex("users").where({ id: id }).first();
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isTagsByUser = await knex("movie_tags").where({ user_id: id });
    if (isTagsByUser.length > 0) {
      throw new AppError(
        `please delete first all notes cerated by this user_id:${id}`,
        401
      );
    } else {
      await knex("users").where({ id: id }).delete();

      response.status(204).json();
    }
  }
}

module.exports = UsersController;
