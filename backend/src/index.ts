import { start } from "./server";

async function run() {
  await start();
}

run().catch((error) => {
  console.error("Error starting the server:", error);
});
