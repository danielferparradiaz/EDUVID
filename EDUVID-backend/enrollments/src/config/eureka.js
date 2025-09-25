import { Eureka } from "eureka-js-client";

const eurekaClient = new Eureka({
  instance: {
    app: "ENROLLMENT-SERVICE",
    hostName: "localhost",
    ipAddr: "127.0.0.1",
    port: {
      $: 8088,
      "@enabled": true,
    },
    vipAddress: "ENROLLMENT-SERVICE",
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
    console.error("❌ Error registrando ENROLLMENT-SERVICE en Eureka:", error);
  } else {
    console.log("✅ ENROLLMENT-SERVICE registrado en Eureka");
  }
});

export default eurekaClient;
