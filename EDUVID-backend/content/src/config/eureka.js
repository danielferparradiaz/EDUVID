import { Eureka } from "eureka-js-client";

const eurekaClient = new Eureka({
  instance: {
    app: "CONTENT-SERVICE",
    hostName: "content-service",
    ipAddr: "content-service",
    preferIpAddress: true,
    port: {
      $: 5003,
      "@enabled": true,
    },
    vipAddress: "CONTENT-SERVICE",
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
    console.error("❌ Error registrando CONTENT-SERVICE en Eureka:", error);
  } else {
    console.log("✅ CONTENT-SERVICE registrado en Eureka");
  }
});

export default eurekaClient;
