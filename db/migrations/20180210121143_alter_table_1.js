
exports.up = function(knex, Promise) {
  return knex.schema.table(`photos`, function(table) {
    table.dropUnique(`link`);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table(`photos`, function(table) {
    table.unique(`link`);
  });
};
