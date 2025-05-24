"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const Image_1 = require("../models/Image");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
// POST /api/images – kuvan lataus
router.post("/", upload.single("image"), async (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: "No file uploaded" });
    const imageUrl = `/uploads/${req.file.filename}`;
    const newImage = new Image_1.ImageModel({ imageUrl });
    try {
        await newImage.save();
        res.status(201).json(newImage);
    }
    catch (err) {
        console.error("Kuvan tallennus epäonnistui:", err);
        res.status(500).json({ error: "Kuvan tallennus epäonnistui" });
    }
});
// GET /api/images – hae kaikki kuvat
router.get("/", async (_req, res) => {
    try {
        const images = await Image_1.ImageModel.find().sort({ uploadedAt: -1 });
        res.json(images);
    }
    catch (err) {
        res.status(500).json({ error: "Virhe haettaessa kuvia" });
    }
});
exports.default = router;
