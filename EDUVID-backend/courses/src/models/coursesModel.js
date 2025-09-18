import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Course = sequelize.define("courses", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  instructorId: { // ← Mapeo de teacher_id
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "teacher_id" // IMPORTANTE: Nombre real en la DB
  },
  nombre: { // ← Mapeo de title
    type: DataTypes.STRING,
    allowNull: false,
    field: "title"
  },
  descripcion: { // ← Mapeo de description
    type: DataTypes.TEXT,
    allowNull: true,
    field: "description"
  },
  videoUrl: { // ← Mapeo de video_url
    type: DataTypes.STRING,
    allowNull: true,
    field: "video_url"
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "category"
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "created_at"
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "updated_at"
  }
}, {
  tableName: "courses",
  timestamps: false
});

export default Course;
