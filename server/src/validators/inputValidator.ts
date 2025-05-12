import { body } from "express-validator"

// this is just input validation for registering 
// basically check if email is an email, if password is convoluted enough
const registerValidation = [
    body("email")
      .isLength({ min: 3})
      .withMessage("Tee nimestä pidempi")
      .escape(),
    body("password")
  ];


export { registerValidation } 