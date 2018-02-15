
exports.up = function(knex, Promise) {
  return knex.schema.table(`photos`, function(table) {
    table.string(`title`).defaultTo(`Untitled`);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table(`photos`, function(table) {
    table.dropColumn(`title`);
  });
};
