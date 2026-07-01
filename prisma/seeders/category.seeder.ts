import prisma from "../../src/config/prisma";

const categories = [
    {
        name: "Electronics",
        description: "Electronic devices"
    },
    {
        name: "Office Supplies",
        description: "Office materials"
    },
    {
        name: "Networking",
        description: "Networking equipment"
    },
    {
        name: "Furniture",
        description: "Office furniture"
    },
    {
        name: "Miscellaneous",
        description: "Other inventory"
    }
];

export async function seedCategories() {

    for (const category of categories) {

        const exists = await prisma.category.findUnique({
            where: {
                name: category.name,
            },
        });

        if (exists)
            continue;

        await prisma.category.create({
            data: category,
        });

        console.log(`✔ Created category: ${category.name}`);
    }

}