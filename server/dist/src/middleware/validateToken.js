"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdmin = exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // make variables from dotenv available
const validateToken = async (req, res, next) => {
    const token = req.header('authorization')?.split(" ")[1]; // get the token, its a string or undefined. should be found on header. needs to be split coz it has the Bearer
    if (!token)
        return res.status(401).json({ message: "Token not found." }); // if no token respond with 401 unauthorized error
    try { // token verification
        const verified = jsonwebtoken_1.default.verify(token, process.env.SECRET); // check if token is valid
        req.user = verified; // assign decoded payload to user
        next(); //proceed
    }
    catch (error) { // if verification fails, respond with 401 unauthorized
        res.status(401).json({ message: "Token not found." });
    }
};
exports.validateToken = validateToken;
const validateAdmin = (req, res, next) => {
    const token = req.header('authorization')?.split(" ")[1]; // extract token
    if (!token)
        return res.status(401).json({ message: "Access denied." }); // same as before
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.SECRET); // same as before
        const user = verified;
        if (!user.isAdmin) { // check if isAdmin exists in payload
            return res.status(403).json({ message: "Access denied." }); // if admin = false or missing, return 403 access denied
        }
        req.user = user; // if verification passes attach user to req.user 
        next(); // proceed
    }
    catch (error) {
        res.status(403).json({ message: "Access denied." });
    }
};
exports.validateAdmin = validateAdmin;
