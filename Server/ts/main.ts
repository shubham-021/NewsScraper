import express from 'express'
import { PrismaClient } from '../src/generated/prisma'
import Cors from 'cors'

const prisma = new PrismaClient

const app = express()
app.use(Cors())
app.use(express.json())

app.get('/api/articles/:date', async (req, res) => {
  const requestedDate = new Date(req.params.date);
  const dateString = requestedDate.toISOString().split('T')[0];
  const limit = parseInt(req.query.limit as string, 10) || 8;

  try {
    const articles = await prisma.headlines.findMany();

    const filtered = articles.filter(article =>
        article.date.toISOString().split('T')[0] === dateString
    );


    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000 , () => {
    console.log("Server running successfully")
})