import mongoose, { Schema, Document } from "mongoose";


// interface for a card document
interface ICard extends Document {
  title: string;
  description?: string;
  columnId: mongoose.Schema.Types.ObjectId; // the id of the column this card belongs to
  userId: string; // the id of the user this card belongs to
}


// mongoose schema for the Card model
const CardSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  columnId: { type: Schema.Types.ObjectId, ref: "Column", required: true }, // references a column 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true} // references a user
});

// create and export the card model based on the schema
const Card: mongoose.Model<ICard> = mongoose.model<ICard>("Card", CardSchema);

export { Card, ICard }