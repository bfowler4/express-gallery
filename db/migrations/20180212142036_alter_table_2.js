
exports.up = function(knex, Promise) {
  return knex.schema.table(`photos`, function(table) {
    table.integer(`user_id`).notNullable();
    table.foreign(`user_id`).references(`users.id`);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table(`photos`, function(table) {
    table.dropColumn(`user_id`);
  });
};
