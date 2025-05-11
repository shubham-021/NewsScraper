import { PrismaClient } from "../src/generated/prisma"

const prisma = new PrismaClient()

export async function createHeadlines(headlines: {
  title: string
  category: string
  link: string
  date: Date
  description: string
}[]) {
  try {
    const result = await prisma.headlines.createMany({
      data: headlines,
      skipDuplicates: true // Skip if link already exists
    })
    console.log(`Created ${result.count} new headlines`)
    return result
  } catch (error) {
    console.error('Error creating headlines:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}