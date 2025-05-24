"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const user_1 = __importDefault(require("./src/routes/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const column_1 = __importDefault(require("./src/routes/column"));
const card_1 = __importDefault(require("./src/routes/card"));
dotenv_1.default.config(); // load variables from .env
const app = (0, express_1.default)(); // express app
const port = Number(process.env.PORT) || 1234; // set port from .env or 1234
// If environment is development, configure CORS
if (process.env.NODE_ENV === 'development') {
    const corsOptions = {
        origin: 'http://localhost:3000', // allow requests from the frontend at localhost:3000
        optionsSuccessStatus: 200,
    };
    app.use((0, cors_1.default)(corsOptions)); // enable CORS
}
// MongoDB setup
const mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/testdb"; // MongoDB URL
mongoose_1.default.connect(mongoDB); // connect to the database
mongoose_1.default.Promise = Promise; // set mongoose to use promises for async
const db = mongoose_1.default.connection; // MongoDB connection instance
db.on("error", console.error.bind(console, "MongoDB connection error")); // error handling for MongoDB connection
app.use(express_1.default.json()); // parse incoming requests with JSON payloads
app.use((0, morgan_1.default)("dev")); // log HTTP requests in dev format
app.use(express_1.default.static(path_1.default.join(__dirname, "../public"))); // serve files from the public folder
// Route handlers
app.use("/api/user", user_1.default); // user-related routes
app.use("/api/columns", column_1.default); // column-related routes
app.use("/api/cards", card_1.default); // card-related routes
// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
// Start server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
