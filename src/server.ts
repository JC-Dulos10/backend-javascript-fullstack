import "dotenv/config";
import app from "./app";

// Start the HTTP server using the configured port.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});