"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ImageSchema = new mongoose_1.default.Schema({
    imageUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
});
exports.ImageModel = mongoose_1.default.model("Image", ImageSchema);
