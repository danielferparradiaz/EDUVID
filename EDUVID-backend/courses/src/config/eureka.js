import { Eureka } from "eureka-js-client";

const eurekaClient = new Eureka({
  instance: {
    app: "COURSES-SERVICE",
    hostName: "courses-service",
    ipAddr: "courses-service",
    preferIpAddress: true,
    port: {
      $: 8095,
      "@enabled": true,
    },
    vipAddress: "COURSES-SERVICE",
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
    console.error("❌ Error registrando COURSES-SERVICE en Eureka:", error);
  } else {
    console.log("✅ COURSES-SERVICE registrado en Eureka");
  }
});

export default eurekaClient;
