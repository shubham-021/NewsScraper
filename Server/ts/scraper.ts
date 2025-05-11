import puppeteer, { Browser, Page } from 'puppeteer';

interface Article {
    title: string;
    link: string;
}

interface NewsData {
    title: string;
    link: string;
    date: string;
    category: string;
    description: string;
}

export default async function scrapeHinduSection(url: string, category: string): Promise<NewsData[]> {
    let browser: Browser | null = null;
    
    try {
        browser = await puppeteer.launch({ headless: false, defaultViewport: null });
        const page: Page = await browser.newPage();

        await page.goto(url, { timeout: 60000 });
        console.log(`Navigated to ${url}`);

        await page.waitForSelector('.element');

        const articles: Article[] = await page.$$eval(".element", (nodes) =>
            nodes
                .map((el) => {
                    const anchor = el.querySelector("h3.title.big > a") as HTMLAnchorElement;
                    return anchor
                        ? {
                            title: anchor.textContent?.trim() || '',
                            link: anchor.href,
                        }
                        : null;
                })
                .filter((article): article is Article => article !== null)
        );

        console.log(`Found ${articles.length} articles on ${category} page`);

        const scrapedData: NewsData[] = [];

        for (const article of articles) {
            let articlePage: Page | null = null;
            try {
                articlePage = await browser.newPage();
                await articlePage.goto(article.link, { timeout: 60000 });

                await articlePage.waitForSelector('h1.title');

                const description: string = await articlePage
                    .$eval("h2.sub-title", (el) => el.textContent?.trim() || '')
                    .catch(() => "");

                let rawDateText: string = await articlePage
                    .$eval(".publish-time-new span", (el) => el.textContent?.trim() || '')
                    .catch(async () => {
                 if (!articlePage) return "";
                    return articlePage
                    .$eval(".updated-time span", (el) => el.textContent?.trim() || '')
                    .catch(() => "");
    });

                rawDateText = rawDateText.replace(/^[-\s]*(Published|Updated)?[-\s]*/i, "").trim();
                const cleanedDate: string = rawDateText.replace(/\s*IST\s*.*$/, "").trim();

                const parsedDate: Date = new Date(cleanedDate);
                if (isNaN(parsedDate.getTime())) {
                    console.warn(`Invalid date: ${rawDateText}`);
                    continue;
                }

                const newsData: NewsData = {
                    title: article.title,
                    link: article.link,
                    date: parsedDate.toISOString(),
                    category,
                    description
                };

                scrapedData.push(newsData);
                console.log("Scraped:", newsData.title);

            } catch (error) {
                console.error('⚠️ Skipping due to error:', error instanceof Error ? error.message : String(error));
            } finally {
                if (articlePage) {
                    await articlePage.close();
                }
            }
        }

        return scrapedData;
    } catch (err) {
        console.error("❌ Scraping error:", err instanceof Error ? err.message : String(err));
        return [];
    } finally {
        if (browser) {
            await browser.close();
        }
        console.log(`Scraping completed for ${category}`);
    }
}

// Example usage:
// (async () => {
//     const worldNews = await scrapeHinduSection("https://www.thehindu.com/news/international/", "World Affairs");
//     const scienceNews = await scrapeHinduSection("https://www.thehindu.com/sci-tech/science/", "Science");
//     console.log(worldNews, scienceNews);
// })();