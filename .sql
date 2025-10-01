DROP DATABASE IF EXISTS eduvid;
CREATE DATABASE eduvid;
USE eduvid;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('profesor', 'estudiante') NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE lessons (
    lessonId INT AUTO_INCREMENT PRIMARY KEY,
    courseId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE enrollment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT NOT NULL,
    instructorId INT NOT NULL,
    courseId INT NOT NULL,
    enrollmentDateStart DATETIME NOT NULL,
    enrollmentDateEnd DATETIME,
    FOREIGN KEY (studentId) REFERENCES usuarios(id),
    FOREIGN KEY (instructorId) REFERENCES usuarios(id),
    FOREIGN KEY (courseId) REFERENCES courses(id)
);

CREATE TABLE progress (
    userId INT NOT NULL,
    courseId INT NOT NULL,
    completedLessons JSON NOT NULL DEFAULT (JSON_ARRAY()),
    percentage FLOAT NOT NULL DEFAULT 0,
    PRIMARY KEY (userId, courseId),
    FOREIGN KEY (userId) REFERENCES usuarios(id),
    FOREIGN KEY (courseId) REFERENCES courses(id)
);

CREATE TABLE certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  courseId INT NOT NULL,
  file_url VARCHAR(255) DEFAULT NULL,
  content LONGTEXT DEFAULT NULL,
  issuedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_certificates_user FOREIGN KEY (userId) REFERENCES usuarios(id),
  CONSTRAINT fk_certificates_course FOREIGN KEY (courseId) REFERENCES courses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;





-- Usuarios
INSERT INTO usuarios (id, email, password, rol, creado_en) VALUES
(1, 'admin@eduvid.com',             '$2b$10$kiZ8c8SGdwkm9PF3mGuV7umfDGl5JokcOvHSV43giV.0dqfHqrv/S', 'profesor',   '2025-09-15 21:02:31'),
(2, 'danielferparradiaz@gmail.com', '$2b$10$GfcUz04jHMUcfDM7CNTe9.mP7vCs5elAulOG9WYzn3.0BUVFs8wiy', 'estudiante', '2025-09-15 23:45:48'),
(3, 'prueba1@email.com',            '$2b$10$0GPaTJZlzqQaSS7nOpVvHuX5sqy9yL3RDWQybs4eas2B9Alot9dFe', 'estudiante', '2025-09-26 03:47:01');

-- Cursos
INSERT INTO courses (id, teacher_id, title, description, video_url, category, created_at, updated_at) VALUES
(1, 1, 'Introducción a Node.js',   'Curso básico de Node.js con Express',             'https://aulasenvivo.com/wp-content/uploads/2020/06/videoclasesgrabadas.jpg', 'Programación',    '2025-09-23 16:42:09', '2025-09-23 16:42:09'),
(2, 2, 'Fundamentos de Redes',     'Curso introductorio sobre redes de computadoras', 'https://aulasenvivo.com/wp-content/uploads/2020/06/videoclasesgrabadas.jpg', 'Infraestructura', '2025-09-23 16:42:09', '2025-09-23 16:42:09'),
(3, 1, 'Bases de Datos con MySQL', 'Curso sobre modelado y consultas SQL',            'https://aulasenvivo.com/wp-content/uploads/2020/06/videoclasesgrabadas.jpg', 'Bases de Datos',  '2025-09-23 16:42:09', '2025-09-23 16:42:09'),
(4, 3, 'Seguridad Informática',    'Principios de ciberseguridad y buenas prácticas', 'https://aulasenvivo.com/wp-content/uploads/2020/06/videoclasesgrabadas.jpg', 'Seguridad',       '2025-09-23 16:42:09', '2025-09-23 16:42:09'),
(5, 2, 'Angular Avanzado',         'Componentes, servicios y RxJS en Angular',        'https://aulasenvivo.com/wp-content/uploads/2020/06/videoclasesgrabadas.jpg', 'Frontend',        '2025-09-23 16:42:09', '2025-09-23 16:42:09');

-- Lecciones
INSERT INTO lessons (lessonId, courseId, title) VALUES
(1, 1, 'Introducción'),
(2, 1, 'Capítulo 1'),
(3, 1, 'Capitulo 2');

-- Enrollment
INSERT INTO enrollment (id, studentId, instructorId, courseId, enrollmentDateStart, enrollmentDateEnd) VALUES
(1, 2, 1, 1, '2025-09-23 21:46:18', NULL),
(2, 1, 1, 2, '2025-09-25 02:52:09', NULL),
(3, 1, 1, 3, '2025-09-26 07:00:47', NULL);

-- Progress (solo válidos)
INSERT INTO progress (userId, courseId, completedLessons, percentage) VALUES
(2, 1, JSON_ARRAY(2,3,1), 100);
