const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const IndexRoute = require("./Routers/index");
const connectDatabase = require("./Helpers/database/connectDatabase");
const customErrorHandler = require("./Middlewares/Errors/customErrorHandler");

dotenv.config({ path: "./config/config.env" });

connectDatabase();

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",        
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Serve Static Files
app.use("/storyImages", express.static(path.join(__dirname, "public/storyImages")));
app.use("/userPhotos", express.static(path.join(__dirname, "public/userPhotos")));

// Routes
app.use("/", IndexRoute);

// Custom Error Handler Middleware
app.use(customErrorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(` Server running on port ${PORT} - Mode: ${process.env.NODE_ENV}`);
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err, promise) => {
    console.error(` Error: ${err.message}`);
    server.close(() => process.exit(1));
});
