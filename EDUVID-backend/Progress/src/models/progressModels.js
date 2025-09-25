import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const progress = sequelize.define(
  "progress",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,   
    },
    completedLessons: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    percentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    tableName: "progress",
    timestamps: false,
  }
);

export default progress;

