const { DataTypes, Model } = require('sequelize')

const db = require('../db/conn')

//User
const User = require('./User')

const Tips = db.define('Tips', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
    tec: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
})

Tips.belongsTo(User)
User.hasMany(Tips)

module.exports = Tips