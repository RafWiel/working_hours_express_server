'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn('Tasks', 'invoiceDate', {
        type: Sequelize.DATE,
        allowNull: true,
      }, {
        transaction
      });

      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
    }
  },

  async down (queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('Tasks', 'invoiceDate', { transaction }),

      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
    }
  }
};



