
module.exports = (sequelize,DataTypes,Sequelize)=>{
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        validate: {
          isUUID: 4
        },
        readOnly: true
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        writeOnly: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      account_created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        readOnly: true
      },
      account_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false      
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      verification_email_timestamp:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true
      }
    } ,{
      freezeTableName: true,
    })
    return User
  };
  