import { Eureka } from "eureka-js-client";

const eurekaClient = new Eureka({
  instance: {
    app: "PROGRESS-SERVICE",
    hostName: "progress-service",
    ipAddr: "progress-service",
    preferIpAddress: true,
    port: {
      $: 8097,
      "@enabled": true,
    },
    vipAddress: "PROGRESS-SERVICE",
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

eurekaClient.start((error) => {
  if (error) {
    console.error("❌ Error registrando PROGRESS-SERVICE en Eureka:", error);
  } else {
    console.log("✅ PROGRESS-SERVICE registrado en Eureka");
  }
});

export default eurekaClient;
