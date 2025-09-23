import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";



const Enrollment = sequelize.define("enrollment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  instructorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enrollmentDateStart: {
    type: DataTypes.DATE,
    allowNull: false
  },
  enrollmentDateEnd: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "enrollment",   // 👈 nombre EXACTO en la DB
  timestamps: false
});


export default Enrollment;   // ✅ ahora sí tienes export default