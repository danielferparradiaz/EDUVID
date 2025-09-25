import http from "http";
import Connect from "connect";
import url from "url";
import proxy from "proxy-middleware";

const app = new Connect();

app.use("/", proxy(url.parse(" http://localhost:8092/api")));
app.use("/", proxy(" http://localhost:8092/api"));

http.createServer(app).listen(8080, () => {
  console.log("🚀 Gateway corriendo en http://localhost:8080");
});
