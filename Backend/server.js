import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";
import { config } from "./src/config/config.js"

const startServer = async () => {
  try {
    await connectToDB();

    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  } catch (err) {
    console.error("Error starting the server: ", err.message);
    process.exit(1);
  }
};

startServer();
