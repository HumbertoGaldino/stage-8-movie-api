const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MoviesNotesController {
  async create(request, response) {
    const { title, description, movie_rate, tags } = request.body;
    const user_id = request.user.id;

    if (movie_rate < 0 || movie_rate > 5) {
      throw new AppError("A nota deve ser entre 0 e 5.");
    }

    const [note_id] = await knex("movies_notes").insert({
      title,
      description,
      movie_rate,
      user_id,
    });

    const tagsInsert = tags.map((name) => {
      return {
        movie_notes_id: note_id.id,
        user_id,
        name,
      };
    });

    await knex("movie_tags").insert(tagsInsert);

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("movies_notes").where({ id }).first();
    const tags = await knex("movie_tags")
      .where({ movie_notes_id: id })
      .orderBy("name");

    return response.json({
      ...note,
      tags,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movies_notes").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const { title, tags } = request.query;

    const user_id = request.user.id;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());

      notes = await knex("movies_tags")
        .select([
          "movies_notes.id",
          "movies_notes.title",
          "movies_notes.user_id",
        ])
        .where("movies_notes.user_id", user_id)
        .whereLike("movies_notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin(
          "movies_notes",
          "movies_notes.id",
          "movie_tags.movies_notes_id"
        )
        .groupBy("notes.id")
        .orderBy("movies_notes.title");
    } else {
      notes = await knex("movies_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("movie_tags").where({ user_id });
    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
      };
    });

    return response.json(notesWithTags);
  }
}

module.exports = MoviesNotesController;
