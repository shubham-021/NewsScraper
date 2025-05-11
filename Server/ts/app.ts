import scrapeHinduSection from './scraper'
import { createHeadlines } from './db'

async function main() {
  try {
    console.log('Starting scraping process...')
    
    // Scrape both categories in parallel
    const [worldNews, scienceNews] = await Promise.all([
      scrapeHinduSection("https://www.thehindu.com/news/international/", "World Affairs"),
      scrapeHinduSection("https://www.thehindu.com/sci-tech/science/", "Science")
    ])

    console.log(`Scraped ${worldNews.length} world news articles`)
    console.log(`Scraped ${scienceNews.length} science articles`)

    // Combine and transform data
    const allNews = [...worldNews, ...scienceNews].map(article => ({
      title: article.title,
      category: article.category,
      link: article.link,
      date: new Date(article.date), // Convert string to Date
      description: article.description
    }))

    // Store in database
    await createHeadlines(allNews)
    
    console.log('Database population complete!')
  } catch (error) {
    console.error('Error in main process:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

main()