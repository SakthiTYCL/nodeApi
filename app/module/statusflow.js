// profiles table description
module.exports = {
    UserDetial: function (sequelize, Sequelize, modelName) {
        var User = sequelize.define('statusflows', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
           
            process: {
                type: Sequelize.STRING,
                
            },

            action: {
                type: Sequelize.STRING,
               

            },
            status: {
                type: Sequelize.STRING,
               

            },
            
        });
        return User;
    }
}
