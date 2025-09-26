// models/Lesson.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Lesson = sequelize.define("Lesson", {
  lessonId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "lessons",
  timestamps: false
});

export default Lesson;
