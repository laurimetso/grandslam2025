import express, { Express } from 'express';
import path from "path";
import userRouter from "./src/routes/user";
import dotenv from "dotenv";
import mongoose, { Connection } from "mongoose";
import morgan from "morgan";
import cors, { CorsOptions } from 'cors';
import columnRouter from "./src/routes/column";
import cardRouter from "./src/routes/card";

dotenv.config(); // load variables from .env

const app: Express = express(); // express app
const port: number = Number(process.env.PORT) || 1234; // set port from .env or 1234

// If environment is development, configure CORS
if (process.env.NODE_ENV === 'development') {
    const corsOptions: CorsOptions = {
        origin: 'http://localhost:3000', // allow requests from the frontend at localhost:3000
        optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions)); // enable CORS
}

// MongoDB setup
const mongoDB: string = process.env.MONGODB_URI || "mongodb://localhost:27017/testdb"; // MongoDB URL
mongoose.connect(mongoDB); // connect to the database
mongoose.Promise = Promise; // set mongoose to use promises for async

const db: Connection = mongoose.connection; // MongoDB connection instance
db.on("error", console.error.bind(console, "MongoDB connection error")); // error handling for MongoDB connection

app.use(express.json()); // parse incoming requests with JSON payloads
app.use(morgan("dev")); // log HTTP requests in dev format

app.use(express.static(path.join(__dirname, "../public"))); // serve files from the public folder

// Route handlers
app.use("/api/user", userRouter); // user-related routes
app.use("/api/columns", columnRouter); // column-related routes
app.use("/api/cards", cardRouter); // card-related routes

// Error handling middleware (optional but recommended)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
