import db from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
  "Music",
  "Gaming",
  "News & Politics",
  "Entertainment",
  "Sports",
  "Education",
  "Science & Technology",
  "Lifestyle",
  "Travel",
  "Food & Drink",
  "Health & Fitness",
  "Comedy",
  "Animals & Pets",
  "Art & Design",
  "DIY & Crafts",
  "Fashion & Beauty",
  "Automotive",
  "Business & Finance",
  "Books & Literature",
  "Movies & TV Shows",
  "Podcasts & Audio",
  "Photography",
];

async function main() {
  console.log("Seeding categories...");

  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `Category for ${name.toLowerCase()}`,
    }));

    await db.insert(categories).values(values);

    console.log("Categories seeded successfully.");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

main();
