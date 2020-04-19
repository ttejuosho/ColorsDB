const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    const Chamber = sequelize.define("Chamber", {
      Company: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Contact: {
        type: Sequelize.STRING
      },
      Title: {
        type: Sequelize.STRING
      },
      Direct_Phone: {
        type: Sequelize.STRING
      },
      Email: {
        type: Sequelize.STRING
      },
      Address: {
        type: Sequelize.STRING
      },
      City: {
        type: Sequelize.STRING
      },
      State: {
        type: Sequelize.STRING
      },
      Zip: {
        type: Sequelize.STRING
      },
      County: {
        type: Sequelize.STRING
      },
      Phone: {
        type: Sequelize.STRING
      },
      Website: {
        type: Sequelize.STRING
      },
      SIC_Code: {
        type: Sequelize.STRING
      },
      Industry: {
        type: Sequelize.STRING
      },
      Sales: {
        type: Sequelize.STRING
      }
    });
    return Chamber;
  };