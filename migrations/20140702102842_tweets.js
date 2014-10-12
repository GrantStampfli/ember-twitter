'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('tweets', function(table) {
    table.increments('id').primary();
    table.integer('user_id').references('users.id')
    table.string('tweet').notNullable();
    table.dateTime('timestamp').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tweets');
};