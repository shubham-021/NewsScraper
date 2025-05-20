"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../src/generated/prisma");
const cors_1 = __importDefault(require("cors"));
const prisma = new prisma_1.PrismaClient;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/articles/:date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestedDate = new Date(req.params.date);
    const dateString = requestedDate.toISOString().split('T')[0];
    const limit = parseInt(req.query.limit, 10) || 8;
    try {
        const articles = yield prisma.headlines.findMany();
        const filtered = articles.filter(article => article.date.toISOString().split('T')[0] === dateString);
        res.json(filtered);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
}));
app.listen(3000, () => {
    console.log("Server running successfully");
});
