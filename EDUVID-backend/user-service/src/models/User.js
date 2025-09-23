import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("usuarios", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

export default User;   // ✅ ahora sí tienes export default
