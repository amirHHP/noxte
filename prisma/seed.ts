import { PrismaClient } from "@prisma/client";
import { SEED_PRODUCTS } from "../src/lib/products";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products to database...");
  let seededCount = 0;
  for (let i = 0; i < SEED_PRODUCTS.length; i++) {
    const p = SEED_PRODUCTS[i];
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        nameEn: p.nameEn,
        description: p.description,
        price: p.price,
        emoji: p.emoji,
        color: p.color,
        traits: p.traits,
        occasion: p.occasion,
        size: p.size,
      },
      create: {
        id: p.id,
        name: p.name,
        nameEn: p.nameEn,
        description: p.description,
        price: p.price,
        emoji: p.emoji,
        color: p.color,
        traits: p.traits,
        occasion: p.occasion,
        size: p.size,
        isActive: true,
        sortOrder: i,
      },
    });
    seededCount++;
  }
  console.log(`Successfully seeded ${seededCount} products!`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
