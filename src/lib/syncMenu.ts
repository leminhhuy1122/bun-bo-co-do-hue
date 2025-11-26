// src/lib/syncMenu.ts - Sync menu data from DB to JSON file
import { query } from "./db";
import fs from "fs/promises";
import path from "path";

export async function syncMenuToJson() {
  try {
    console.log("🔄 Syncing menu from database to menu.json...");

    // Fetch all menu items from database
    const items = await query(`
      SELECT 
        id,
        name,
        slug,
        description,
        price,
        category,
        image_url as image,
        is_featured as popular,
        is_spicy,
        preparation_time,
        is_available as available,
        sold_count,
        rating
      FROM menu_items 
      ORDER BY category, name
    `);

    // Transform to match JSON structure
    const menuData = Array.isArray(items)
      ? items.map((item: any) => ({
          id: item.slug || item.id.toString(),
          name: item.name,
          description: item.description,
          price: parseFloat(item.price),
          category: item.category,
          image: item.image || `/images/${item.slug}.jpg`,
          popular: Boolean(item.popular),
          spicyLevel: item.is_spicy ? 5 : 0,
          available: Boolean(item.available),
        }))
      : [];

    // Write to menu.json
    const menuFilePath = path.join(process.cwd(), "src", "data", "menu.json");
    await fs.writeFile(
      menuFilePath,
      JSON.stringify(menuData, null, 2),
      "utf-8"
    );

    console.log(`✅ Synced ${menuData.length} menu items to menu.json`);
    return { success: true, count: menuData.length };
  } catch (error) {
    console.error("❌ Error syncing menu:", error);
    throw error;
  }
}
