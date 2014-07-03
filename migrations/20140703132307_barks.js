
'use strict';

exports.up = function(knex, Promise) {

  return knex.schema.createTable('barks', function(table) {
    table.increments('id').primary();
    table.integer('author_id').references('users.id');
    table.string('content').notNullable();
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('barks');
};
