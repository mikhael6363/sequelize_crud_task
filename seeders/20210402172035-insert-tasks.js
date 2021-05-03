'use strict';

const { QueryTypes } = require('sequelize');
const _ = require('lodash');
const { User } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({
      attributes: ['id'],
    });

    const tasks = users
      .map(u => {
        return new Array(_.random(1, 10, false)).fill(null).map((_, i) => ({
          user_id: u.id,
          body: `Testbody${i}`,
          created_at: new Date(),
          updated_at: new Date(),
        }));
      })
      .flat(2);

    queryInterface.bulkInsert('tasks', tasks, {});
  },

  down: async (queryInterface, Sequelize) => {},
};