import { db } from "@/lib/db";

async function main() {
    const user = await db.user.findFirst();
    if (!user) {
        console.error("No user found");
        return;
    }

    const request = await db.purchaseRequest.create({
        data: {
            userId: user.id,
            justification: "Timezone Test Request",
            dueDate: new Date("2025-11-25"), // UTC midnight
            items: [
                { description: "Test Date 25/11", quantity: 1, unit: "Item", category: "Test" }
            ],
            status: "DRAFT",
            updatedBy: user.id,
        },
    });

    console.log("Request created:", request.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
