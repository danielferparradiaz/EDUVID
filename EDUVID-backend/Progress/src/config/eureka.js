import { Eureka } from "eureka-js-client";

const eurekaClient = new Eureka({
  instance: {
    app: "progress-SERVICE",
    hostName: "localhost",
    ipAddr: "127.0.0.1",
    port: {
      $: 8097,
      "@enabled": true,
    },
    vipAddress: "progress-SERVICE",
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
    console.error("❌ Error registrando progress-SERVICE en Eureka:", error);
  } else {
    console.log("✅ progress-SERVICE registrado en Eureka");
  }
});

export default eurekaClient;
