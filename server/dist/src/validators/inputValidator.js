"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
// this is just input validation for registering 
// basically check if email is an email, if password is convoluted enough
const registerValidation = [
    (0, express_validator_1.body)("email")
        .isLength({ min: 3 })
        .withMessage("Tee nimestä pidempi")
        .escape(),
    (0, express_validator_1.body)("password")
];
exports.registerValidation = registerValidation;
