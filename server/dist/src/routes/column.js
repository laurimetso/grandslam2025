"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Column_1 = require("../models/Column");
const validateToken_1 = require("../middleware/validateToken");
const Card_1 = require("../models/Card");
const router = express_1.default.Router();
// get columns
router.get("/", validateToken_1.validateToken, async (req, res) => {
    try {
        const userId = req.user?.id; // extract user id from request
        if (!userId)
            return res.status(401).json({ message: "unauthorized" }); // check if user exists
        const adminCheck = req.user?.isAdmin; // check if user is an admin
        if (adminCheck == false) { // if user is not an admin fetch only their own columns
            const columns = await Column_1.Column.find({ userId }); // get columns which have the users id
            res.json(columns); // send columns as JSON 
        }
        else { // if user is an admin
            const columns = await Column_1.Column.find(); // get all columns in database
            res.json(columns); // send columns as JSON
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching columns" }); // catch error respond with 500
    }
});
// create new column
router.post("/", validateToken_1.validateToken, async (req, res) => {
    try {
        const title = req.body.title; // get new column title from request body
        const userId = req.user?.id; // get user ID from token
        const newColumn = new Column_1.Column({ title, userId }); // make a new column with the new title and associated user id
        await newColumn.save(); // save new colun to database
        res.status(201).json(newColumn); // respond with new column as JSON
    }
    catch (error) {
        res.status(400).json({ message: "Error creating column" });
    }
});
// rename column
router.put("/:columnId", validateToken_1.validateToken, async (req, res) => {
    try {
        const title = req.body.title; // get new column title from request body
        const userId = req.user?.id; // get user ID from token
        const columnId = req.params.columnId; // get column id from the request parameters
        if (!title || title.trim() === "") { // check if the title is valid
            return res.status(400).json({ message: "Title cannot be empty" }); // if the title is invalid, return 400 status
        }
        const column = await Column_1.Column.findOne({ _id: columnId, userId }); // find the correct column in the database by columnId and userId
        // if the column doesnt exist, return 400
        if (!column) {
            return res.status(400).json({ message: "Column not found." });
        }
        column.title = title; // update the columns title with new title
        await column.save(); // save to database
        //respond with the updated title as JSON to help in frontend update
        res.json({ title });
    }
    catch (error) {
        res.status(500).json({ message: "Error renaming column" });
    }
});
//delete column
router.delete("/:id", validateToken_1.validateToken, async (req, res) => {
    const { id } = req.params; // get column id from request parameters
    try {
        const result = await Card_1.Card.deleteMany({ columnId: id }); // delete all cards with the column id provided 
        const deletedColumn = await Column_1.Column.findByIdAndDelete(id); // delete the column itself
        // if the column is not found, return an error message
        if (!deletedColumn) {
            return res.status(404).json({ message: "Column not found" });
        }
        // return successful deletion response (no content, 204)
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting column:", error);
        res.status(500).json({ message: "Error deleting column" });
    }
});
exports.default = router;
