import express, { Request, Response, Router } from "express"
import { Result, ValidationError, validationResult } from "express-validator"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { IUser, User}  from "../models/User"
import { registerValidation } from "../validators/inputValidator"

const router: Router = Router()


router.post("/register", 
    registerValidation, // validation middleware that validates user input
    async (req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req) // validation checks on the incoming req body e.g. email, password

        if(!errors.isEmpty()) { // if there are validation errors, log them and return a 400
            return res.status(400).json({errors: errors.array()})
        }

    try {
        const existingUser: IUser | null = await User.findOne({email: req.body.email}) // check if user exists in database

        if (existingUser) { // if user exists return a 403 error with a message that the email is in use
            return res.status(403).json({
                errors: [{path: 'email',msg: 'email is already in use.'}] // hardcoded email is already in use
              });
        }

        const salt: string = bcrypt.genSaltSync(10) // generate salt for password hashing
        const hash: string = bcrypt.hashSync(req.body.password, salt) // hash the password using bcrypt 


        // create a new user object with the validated data
        const newUser = new User({ 
            email: req.body.email,
            password: hash,
            isAdmin: req.body.isAdmin
        })

        await newUser.save() // save user to database
        return res.json(newUser) // respond with new user as JSON


    } catch (error: any) {
        console.error(`error during registration: ${error}`)
        return res.status(500).json({error: "internal server error"})
    } 
    }
)


router.get('/',
    async (req: Request, res: Response) =>{
        try{
            const users = await User.find()
            res.json(users)
        } catch (err) {
            res.status(500).json({ message: "Server error when fetching players! "})
        }
    }
)

router.put("/:id/points", async (req, res) => {
  const { id } = req.params
  const { points } = req.body
  console.log("Updating user", id, "to points:", points);
  try {
    const user = await User.findByIdAndUpdate(id, { points }, { new: true })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to update points" })
  }
})


router.post("/login",
    async (req: Request, res: Response) =>{
        try {
            const user: IUser | null = await User.findOne({email: req.body.email}) // attempt to find a user by their email address
            if (!user) {
                return res.status(404).json({message: "Wrong email or password"}) // if user is not found return a 404
            }

            if (bcrypt.compareSync(req.body.password, user.password)) { // compare the provided password with the hashed password stored in database
                const jwtPayload: JwtPayload =  { // if passwords match, create a JWT payload containing user data
                    id: user._id,
                    email: user.email,
                    isAdmin: user.isAdmin
                }
                // sign the JWT with a secret key from .env and set the expiration to 7 days
                const token: string = jwt.sign(jwtPayload, 
                process.env.SECRET as string,{ expiresIn: "7d"})

                return res.status(200).json({success: true, token}) // return success and token 

            } else {
                return res.status(401).json({message: "Login failed"}) // if password is incorrect return a 401 
                
            }

        } catch(error: any) {
            console.error(`Error during user login: ${error}`)
            return res.status(500).json({ error: `Internal server error`})
        }
    }
)



export default router