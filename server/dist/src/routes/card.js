"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Card_1 = require("../models/Card");
const validateToken_1 = require("../middleware/validateToken");
const router = express_1.default.Router();
// get cards for authenticated user with GET
router.get("/", validateToken_1.validateToken, async (req, res) => {
    try {
        const userId = req.user?.id; // extract user id from request
        if (!userId)
            return res.status(401).json({ message: "unauthorized" }); // check if user exists
        const adminCheck = req.user?.isAdmin; // check if user is an admin
        if (adminCheck == false) { // if user is not an admin fetch only their own cards
            const cards = await Card_1.Card.find({ userId }); // get cards which have the users id
            res.json(cards); // send cards as JSON 
        }
        else { // if user is an admin
            const cards = await Card_1.Card.find(); // get all cards in database
            res.json(cards); // send cards as JSON
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching columns" });
    }
});
// get all cards in a column for authenticated user with GET
router.get("/:columnId", validateToken_1.validateToken, async (req, res) => {
    try {
        const userId = req.user?.id; // extract user id from request
        if (!userId)
            return res.status(401).json({ message: "unauthorized" }); // check if user exists
        const columnId = req.params.columnId; // extract column id from request
        const cards = await Card_1.Card.find({ columnId, userId }); // fetch all cards that belong to the user and column
        res.json(cards); //return fetched cards
    }
    catch (error) {
        res.status(500).json({ message: "error fetching cards" });
    }
});
// create a new card with POST
router.post("/", validateToken_1.validateToken, async (req, res) => {
    try {
        const { title, description, columnId } = req.body; // extract fields from request
        const userId = req.user?.id; // check that user is authenticated
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        // create a new card instance: 
        const newCard = new Card_1.Card({
            title,
            description,
            columnId,
            userId,
        });
        await newCard.save(); // save card to database
        res.status(201).json(newCard); // return the new card
    }
    catch (error) {
        res.status(400).json({ message: "error creating card" });
    }
});
// move a card to another column with a PUT request
router.put("/:id", validateToken_1.validateToken, async (req, res) => {
    try {
        const updatedCard = await Card_1.Card.findByIdAndUpdate(// attempt to find a card by its id and update its column id
        req.params.id, { columnId: req.body.columnId }, { new: true } // this makes sure the response will contain the updated card after the change
        );
        res.json(updatedCard); // if update is successful, return the updated card as JSON
    }
    catch (error) {
        res.status(500).json({ message: "error updating card" });
    }
});
// delete a card with DELETE
router.delete("/:id", validateToken_1.validateToken, async (req, res) => {
    try {
        await Card_1.Card.findByIdAndDelete(req.params.id); // attempt to find a card by its id and delete it 
        res.status(204).send(); // if deleted succesfully, respond with 204 success status
    }
    catch (error) {
        res.status(500).json({ message: "error deleting card" }); // if not, respond with 500 error
    }
});
exports.default = router;
