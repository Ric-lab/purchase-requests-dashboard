import { db } from "./lib/db";

async function main() {
    try {
        console.log("Testing DB connection...");
        const suppliers = await db.supplier.findMany();
        console.log("Suppliers fetched successfully:", suppliers);
    } catch (error) {
        console.error("Error fetching suppliers:", error);
    }
}

main();
