"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const docs_container_1 = __importDefault(require("../container/docs.container"));
const router = (0, express_1.Router)();
// Simple documentation endpoint for quickly reviewing the available API surface.
router.get("/", docs_container_1.default.getDocs);
exports.default = router;
