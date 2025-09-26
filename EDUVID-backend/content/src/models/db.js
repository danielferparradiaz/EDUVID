// Base de datos simulada en memoria
const lessons = [
  {
    id: 1,
    courseId: 1,
    title: "Introducción a Redes",
    description: "Conceptos básicos de redes e infraestructura",
    order: 1,
    resourceUrl: "https://example.com/intro.pdf"
  },
  {
    id: 2,
    courseId: 1,
    title: "Modelo OSI",
    description: "Capas y funciones",
    order: 2,
    resourceUrl: "https://example.com/osi.pdf"
  }
];

module.exports = { lessons };
