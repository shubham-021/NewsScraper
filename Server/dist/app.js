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
const scraper_1 = __importDefault(require("./scraper"));
const db_1 = require("./db");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting scraping process...');
            // Scrape both categories in parallel
            const [worldNews, scienceNews] = yield Promise.all([
                (0, scraper_1.default)("https://www.thehindu.com/news/international/", "World Affairs"),
                (0, scraper_1.default)("https://www.thehindu.com/sci-tech/science/", "Science")
            ]);
            console.log(`Scraped ${worldNews.length} world news articles`);
            console.log(`Scraped ${scienceNews.length} science articles`);
            // Combine and transform data
            const allNews = [...worldNews, ...scienceNews].map(article => ({
                title: article.title,
                category: article.category,
                link: article.link,
                date: new Date(article.date), // Convert string to Date
                description: article.description
            }));
            // Store in database
            yield (0, db_1.createHeadlines)(allNews);
            console.log('Database population complete!');
        }
        catch (error) {
            console.error('Error in main process:', error);
            process.exit(1);
        }
        finally {
            process.exit(0);
        }
    });
}
main();
