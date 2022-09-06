const { Sequelize } = require('sequelize'); //Chamar modelo do require

//Definir a conexção
const sequelize = new Sequelize('tips', 'postgres', '', {
    host: 'localhost',
    dialect: 'postgres'
});


//Realizar conexção
try{
    sequelize.authenticate()
    console.log('Connected')
}catch(err){
    console.log(`Error ${err}`)
}

//Exporta modulo
module.exports = sequelize