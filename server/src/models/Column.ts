import mongoose, { Schema, Document } from "mongoose";

// interface for a column document
interface IColumn extends Document {
  title: string;
  userId: string; // id of the user this column belongs to
}


// define the mongoose schema
const ColumnSchema: Schema = new Schema({
  title: { type: String, required: true },
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

});

// create and export the column model based on the schema
const Column: mongoose.Model<IColumn> = mongoose.model<IColumn>("Column", ColumnSchema);

export { Column, IColumn }