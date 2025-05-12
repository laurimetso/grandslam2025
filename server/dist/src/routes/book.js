"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Book_1 = require("../models/Book");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        const { author, name, pages } = req.body;
        const newBook = new Book_1.Book({ author, name, pages });
        await newBook.save();
        res.status(201).json({ message: "Book added successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ error: error.message || "Server error!" });
        }
    }
});
exports.default = router;
