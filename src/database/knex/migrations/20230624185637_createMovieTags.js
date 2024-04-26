
exports.up = knex => knex.schema.createTable("movie_tags", table => {

  table.increments("id")
  table.integer("user_id").references("id").inTable("users")
  table.integer("movie_notes_id").references("id").inTable("movies_notes").onDelete("CASCADE")
  table.integer("tag_name")
})

exports.down = knex => knex.schema.dropTable("movie_tags");
