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
exports.default = scrapeHinduSection;
const puppeteer_1 = __importDefault(require("puppeteer"));
function scrapeHinduSection(url, category) {
    return __awaiter(this, void 0, void 0, function* () {
        let browser = null;
        try {
            browser = yield puppeteer_1.default.launch({ headless: false, defaultViewport: null });
            const page = yield browser.newPage();
            yield page.goto(url, { timeout: 60000 });
            console.log(`Navigated to ${url}`);
            yield page.waitForSelector('.element');
            const articles = yield page.$$eval(".element", (nodes) => nodes
                .map((el) => {
                var _a;
                const anchor = el.querySelector("h3.title.big > a");
                return anchor
                    ? {
                        title: ((_a = anchor.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '',
                        link: anchor.href,
                    }
                    : null;
            })
                .filter((article) => article !== null));
            console.log(`Found ${articles.length} articles on ${category} page`);
            const scrapedData = [];
            for (const article of articles) {
                let articlePage = null;
                try {
                    articlePage = yield browser.newPage();
                    yield articlePage.goto(article.link, { timeout: 60000 });
                    yield articlePage.waitForSelector('h1.title');
                    const description = yield articlePage
                        .$eval("h2.sub-title", (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; })
                        .catch(() => "");
                    let rawDateText = yield articlePage
                        .$eval(".publish-time-new span", (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; })
                        .catch(() => __awaiter(this, void 0, void 0, function* () {
                        if (!articlePage)
                            return "";
                        return articlePage
                            .$eval(".updated-time span", (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; })
                            .catch(() => "");
                    }));
                    rawDateText = rawDateText.replace(/^[-\s]*(Published|Updated)?[-\s]*/i, "").trim();
                    const cleanedDate = rawDateText.replace(/\s*IST\s*.*$/, "").trim();
                    const parsedDate = new Date(cleanedDate);
                    if (isNaN(parsedDate.getTime())) {
                        console.warn(`Invalid date: ${rawDateText}`);
                        continue;
                    }
                    const newsData = {
                        title: article.title,
                        link: article.link,
                        date: parsedDate.toISOString(),
                        category,
                        description
                    };
                    scrapedData.push(newsData);
                    console.log("Scraped:", newsData.title);
                }
                catch (error) {
                    console.error('⚠️ Skipping due to error:', error instanceof Error ? error.message : String(error));
                }
                finally {
                    if (articlePage) {
                        yield articlePage.close();
                    }
                }
            }
            return scrapedData;
        }
        catch (err) {
            console.error("❌ Scraping error:", err instanceof Error ? err.message : String(err));
            return [];
        }
        finally {
            if (browser) {
                yield browser.close();
            }
            console.log(`Scraping completed for ${category}`);
        }
    });
}
// Example usage:
// (async () => {
//     const worldNews = await scrapeHinduSection("https://www.thehindu.com/news/international/", "World Affairs");
//     const scienceNews = await scrapeHinduSection("https://www.thehindu.com/sci-tech/science/", "Science");
//     console.log(worldNews, scienceNews);
// })();
