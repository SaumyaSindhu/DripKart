import "dotenv/config";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const TOTAL_PRODUCTS = 200000;
const BATCH_SIZE = 5000;
const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home",
  "Sports",
  "Books",
  "Beauty",
];

async function generateProducts() {
  try {
    console.log("🌱 Starting seed for 200,000 products...");
    console.log(`📦 Batch size: ${BATCH_SIZE} products per insert`);

    let created = 0;
    const startTime = Date.now();

    for (let i = 0; i < TOTAL_PRODUCTS; i += BATCH_SIZE) {
      const batch = [];
      const batchEnd = Math.min(i + BATCH_SIZE, TOTAL_PRODUCTS);

      // Generate batch data
      for (let j = i; j < batchEnd; j++) {
        batch.push({
          name: `Product ${j + 1}`,
          category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
          price: parseFloat((Math.random() * 5000 + 10).toFixed(2)),
          createdAt: new Date(
            Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
          ),
        });
      }

      // Bulk insert
      await prisma.product.createMany({
        data: batch,
        skipDuplicates: true,
      });

      created += batch.length;
      const percentage = ((created / TOTAL_PRODUCTS) * 100).toFixed(1);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `✓ Progress: ${created.toLocaleString()}/${TOTAL_PRODUCTS.toLocaleString()} (${percentage}%) | ${elapsed}s elapsed`,
      );
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(
      `\n✅ Seed complete! Created ${TOTAL_PRODUCTS.toLocaleString()} products in ${totalTime}s`,
    );

    // Verify
    const count = await prisma.product.count();
    console.log(`📊 Total products in database: ${count.toLocaleString()}`);

    // Category breakdown
    const categories = await prisma.product.groupBy({
      by: ["category"],
      _count: true,
    });

    console.log("\n📂 Products by category:");
    categories.forEach(({ category, _count }) => {
      console.log(`   ${category}: ${_count.toLocaleString()}`);
    });
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

generateProducts();
