import app from "./app";

const port = process.env.port || 8000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

server.on("error", (error) => {
  console.log("Server failed to start");
});
