// certificates/src/config/eureka.js
const { Eureka } = require("eureka-js-client");

const eurekaClient = new Eureka({
  instance: {
    app: "CERTIFICATES-SERVICE",
    hostName: "localhost",
    ipAddr: "127.0.0.1",
    port: {
      $: 8097,
      "@enabled": true,
    },
    vipAddress: "CERTIFICATES-SERVICE",
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

eurekaClient.start((error) => {
  if (error) {
    console.error("❌ Error registrando CERTIFICATES-SERVICE en Eureka:", error);
  } else {
    console.log("✅ CERTIFICATES-SERVICE registrado en Eureka");
  }
});

module.exports = eurekaClient;
