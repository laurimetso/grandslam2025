"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const inputValidator_1 = require("../validators/inputValidator");
const router = (0, express_1.Router)();
router.post("/register", inputValidator_1.registerValidation, // validation middleware that validates user input
async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req); // validation checks on the incoming req body e.g. email, password
    if (!errors.isEmpty()) { // if there are validation errors, log them and return a 400
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const existingUser = await User_1.User.findOne({ email: req.body.email }); // check if user exists in database
        if (existingUser) { // if user exists return a 403 error with a message that the email is in use
            return res.status(403).json({
                errors: [{ path: 'email', msg: 'email is already in use.' }] // hardcoded email is already in use
            });
        }
        const salt = bcrypt_1.default.genSaltSync(10); // generate salt for password hashing
        const hash = bcrypt_1.default.hashSync(req.body.password, salt); // hash the password using bcrypt 
        // create a new user object with the validated data
        const newUser = new User_1.User({
            email: req.body.email,
            password: hash,
            isAdmin: req.body.isAdmin
        });
        await newUser.save(); // save user to database
        return res.json(newUser); // respond with new user as JSON
    }
    catch (error) {
        console.error(`error during registration: ${error}`);
        return res.status(500).json({ error: "internal server error" });
    }
});
router.get('/', async (req, res) => {
    try {
        const users = await User_1.User.find();
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: "Server error when fetching players! " });
    }
});
router.put("/:id/points", async (req, res) => {
    const { id } = req.params;
    const { points } = req.body;
    console.log("Updating user", id, "to points:", points);
    try {
        const user = await User_1.User.findByIdAndUpdate(id, { points }, { new: true });
        res.json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update points" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const user = await User_1.User.findOne({ email: req.body.email }); // attempt to find a user by their email address
        if (!user) {
            return res.status(404).json({ message: "Wrong email or password" }); // if user is not found return a 404
        }
        if (bcrypt_1.default.compareSync(req.body.password, user.password)) { // compare the provided password with the hashed password stored in database
            const jwtPayload = {
                id: user._id,
                email: user.email,
                isAdmin: user.isAdmin
            };
            // sign the JWT with a secret key from .env and set the expiration to 7 days
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: "7d" });
            return res.status(200).json({ success: true, token }); // return success and token 
        }
        else {
            return res.status(401).json({ message: "Login failed" }); // if password is incorrect return a 401 
        }
    }
    catch (error) {
        console.error(`Error during user login: ${error}`);
        return res.status(500).json({ error: `Internal server error` });
    }
});
exports.default = router;
