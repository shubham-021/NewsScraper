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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHeadlines = createHeadlines;
const prisma_1 = require("../src/generated/prisma");
const prisma = new prisma_1.PrismaClient();
function createHeadlines(headlines) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma.headlines.createMany({
                data: headlines,
                skipDuplicates: true // Skip if link already exists
            });
            console.log(`Created ${result.count} new headlines`);
            return result;
        }
        catch (error) {
            console.error('Error creating headlines:', error);
            throw error;
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
