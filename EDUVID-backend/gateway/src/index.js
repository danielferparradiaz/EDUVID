import express from "express";
import { Eureka } from "eureka-js-client";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

// 🔧 Middleware base
app.use(cors({
  origin: [
    "http://front.eduvid.lan",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ⚙️ Configuración Eureka Client
const eureka = new Eureka({
  instance: {
    app: "gateway",
    hostName: "gateway",
    ipAddr: "gateway",
    preferIpAddress: true,
    port: { "$": PORT, "@enabled": true },
    vipAddress: "gateway",
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
  },
  eureka: {
    host: "eureka",
    port: 8761,
    servicePath: "/eureka/apps/",
  },
});

// 🔌 Conexión a Eureka
eureka.start((err) => {
  if (err) {
    console.error("❌ Error registrando gateway en Eureka:", err);
  } else {
    console.log("✅ Gateway registrado en Eureka");
  }
});

// 🧭 Obtener la URL de un servicio desde Eureka
function getServiceUrl(serviceName) {
  const instances = eureka.getInstancesByAppId(serviceName.toUpperCase());
  if (instances.length === 0) return null;
  const instance = instances[0];
  return `http://${instance.hostName}:${instance.port.$}`;
}

// 🚏 Helper para crear proxys fácilmente
function proxyTo(path, serviceName) {
  app.use(path, (req, res, next) => {
    const target = getServiceUrl(serviceName);
    if (!target) {
      console.error(`❌ ${serviceName} not available`);
      return res.status(500).send(`${serviceName} not available`);
    }

    console.log(`➡️ Proxy ${req.method} ${req.originalUrl} → ${target}`);
    return createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^${path}`]: "" }, // 🔥 elimina el prefijo del path
    })(req, res, next);
  });
}

// 🧩 Registrar todos los servicios
proxyTo("/users", "USER-SERVICE");
proxyTo("/courses", "COURSES-SERVICE");
proxyTo("/progress", "PROGRESS-SERVICE");
proxyTo("/enrollment", "ENROLLMENT-SERVICE");
proxyTo("/content", "CONTENT-SERVICE");
proxyTo("/certificates", "CERTIFICATES-SERVICE");

// 🚀 Iniciar Gateway
app.listen(PORT, () => {
  console.log(`🚀 Gateway corriendo en http://localhost:${PORT}`);
});
