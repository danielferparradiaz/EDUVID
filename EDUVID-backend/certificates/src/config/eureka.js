const { Eureka } = require("eureka-js-client");

const eurekaClient = new Eureka({
  instance: {
    app: "CERTIFICATES-SERVICE",
    hostName: "certificates-service", // 👈 nombre del servicio en docker-compose
    ipAddr: "certificates-service",   // 👈 igual que arriba
    preferIpAddress: true,
    port: {
      $: 8085, // 👈 asegúrate de usar el puerto EXPUESTO en tu Dockerfile
      "@enabled": true,
    },
    vipAddress: "CERTIFICATES-SERVICE",
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
  },
  eureka: {
    host: "eureka",       // 👈 nombre del servicio de Eureka en docker-compose
    port: 8761,
    servicePath: "/eureka/apps/",
  },
});

eurekaClient.start((error) => {
  if (error) {
    console.error("❌ Error registrando CERTIFICATES-SERVICE en Eureka:", error);
  } else {
    console.log("✅ CERTIFICATES-SERVICE registrado en Eureka");
  }
});

module.exports = eurekaClient;
