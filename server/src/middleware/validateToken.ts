import {Request, Response, NextFunction} from "express"
import jwt, {JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv"


dotenv.config() // make variables from dotenv available

export interface CustomRequest extends Request { // extend request object to include a user
    user?: JwtPayload
}


export const validateToken = async (req: CustomRequest, res: Response, next:
    NextFunction) => {
    const token: string | undefined = req.header('authorization')?.split(" ")[1] // get the token, its a string or undefined. should be found on header. needs to be split coz it has the Bearer

    if(!token) return res.status(401).json({message: "Token not found."}) // if no token respond with 401 unauthorized error

    try { // token verification
        const verified: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload // check if token is valid
        req.user = verified // assign decoded payload to user
        next() //proceed

    } catch (error: any) { // if verification fails, respond with 401 unauthorized
        res.status(401).json({message: "Token not found."})
        
    }
    
}  
export const validateAdmin = (req: CustomRequest, res: Response, next: // very similar to validateToken but this one checks admin status
    NextFunction) => {
    const token: string | undefined = req.header('authorization')?.split(" ")[1] // extract token
 
    if(!token) return res.status(401).json({message: "Access denied."}) // same as before

    try {
        const verified: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload // same as before
        
        const user = verified as JwtPayload
        if (!user.isAdmin){ // check if isAdmin exists in payload
            return res.status(403).json({ message: "Access denied."}) // if admin = false or missing, return 403 access denied
        }
        req.user = user // if verification passes attach user to req.user 
        next() // proceed

    } catch (error: any) {
        res.status(403).json({message: "Access denied."})

    }
    
}

