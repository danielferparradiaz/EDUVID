import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Usuario = sequelize.define("usuarios", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  rol: { type: DataTypes.ENUM("profesor", "estudiante"), allowNull: false }
}, { tableName: "usuarios", timestamps: false });

const Course = sequelize.define("courses", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  teacher_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false }
}, { tableName: "courses", timestamps: false });

const Enrollment = sequelize.define("enrollment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  studentId: { type: DataTypes.INTEGER, allowNull: false },
  instructorId: { type: DataTypes.INTEGER, allowNull: false },
  courseId: { type: DataTypes.INTEGER, allowNull: false },
  enrollmentDateStart: { type: DataTypes.DATE, allowNull: false },
  enrollmentDateEnd: { type: DataTypes.DATE, allowNull: true }
}, { tableName: "enrollment", timestamps: false });

// Relaciones
Enrollment.belongsTo(Usuario, { foreignKey: "studentId", as: "student" });
Enrollment.belongsTo(Course, { foreignKey: "courseId", as: "course" });
Course.belongsTo(Usuario, { foreignKey: "teacher_id", as: "teacher" });

export { Usuario, Course, Enrollment };
