import mongoose, {Document, Schema} from "mongoose";

// interface for a user document
interface IUser extends Document {
    email: string
    password: string
    isAdmin: Boolean
    points: Number
}

// define mongoose schema
const userSchema: Schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: false},
    points: {type: Number, default: 0}

})

// create and export the user model based on the schema
const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema)

export { User, IUser }