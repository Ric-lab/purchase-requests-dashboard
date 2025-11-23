import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('=== Testing Employees Module ===\n')

    // Test 1: List all employees
    const employees = await prisma.employee.findMany({
        where: { deletedAt: null }
    })
    console.log('Active Employees:', employees.length)
    employees.forEach(emp => {
        console.log(`- ${emp.name} (${emp.email}) - Tier ${emp.access_level}`)
    })

    console.log('\n=== Tests Complete ===')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
