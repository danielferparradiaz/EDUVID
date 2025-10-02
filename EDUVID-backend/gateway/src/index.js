import express from "express";
import { Eureka } from "eureka-js-client";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = process.env.PORT || 8080;

// 👉 Configuración Eureka Client
const eureka = new Eureka({
  instance: {
    app: "gateway-service",
    hostName: "localhost",
    ipAddr: "127.0.0.1",
    port: { "$": PORT, "@enabled": true },
    vipAddress: "gateway-service",
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
  },
  eureka: {
    host: "localhost",
    port: 8761,
    servicePath: "/eureka/apps/",
  },
});

// Conectar a Eureka
eureka.start((err) => {
  if (err) {
    console.error("❌ Error registrando gateway en Eureka:", err);
  } else {
    console.log("✅ Gateway registrado en Eureka");
  }
});

// Función para obtener instancia de servicio desde Eureka
function getServiceUrl(serviceName) {
  const instances = eureka.getInstancesByAppId(serviceName.toUpperCase());
  if (instances.length === 0) return null;
  const instance = instances[0];
  return `http://${instance.hostName}:${instance.port.$}`;
}


app.use("/users", (req, res, next) => {
  const target = getServiceUrl("USER-SERVICE");
  if (!target) return res.status(500).send("User Service not available");
  return createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
});

app.use("/courses", (req, res, next) => {
  const target = getServiceUrl("COURSES-SERVICE");
  if (!target) return res.status(500).send("Courses Service not available");
  return createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
});

app.use("/progress", (req, res, next) => {
  const target = getServiceUrl("PROGRESS-SERVICE");
  if (!target) return res.status(500).send("Progress Service not available");
  return createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
});

app.use("/enrollments", (req, res, next) => {
  const target = getServiceUrl("ENROLLMENTS-SERVICE");
  if (!target) return res.status(500).send("Enrollments Service not available");
  return createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
});

app.use("/content", (req, res, next) => {
  const target = getServiceUrl("CONTENT-SERVICE");
  if (!target) return res.status(500).send("Content Service not available");
  return createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
});

app.use("/certificates", (req, res, next) => {
  const target = getServiceUrl("CERTIFICATES-SERVICE");
  if (!target) return res.status(500).send("Certificates Service not available");
  return createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Gateway corriendo en http://localhost:${PORT}`);
});
