import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const testEmail = 'maria.silva@empresa.com'

    console.log(`=== Checking state for ${testEmail} ===\n`)

    // Check employees
    const employees = await prisma.employee.findMany({
        where: { email: testEmail },
        select: { id: true, name: true, email: true, deletedAt: true }
    })

    console.log('Employees:')
    employees.forEach(emp => {
        const status = emp.deletedAt ? 'DELETED' : 'ACTIVE'
        console.log(`  - ${emp.name} (${status}) [${emp.id}]`)
    })

    // Check users
    const users = await prisma.user.findMany({
        where: { email: testEmail },
        select: { id: true, name: true, email: true, deletedAt: true }
    })

    console.log('\nUsers:')
    users.forEach(user => {
        const status = user.deletedAt ? 'DELETED' : 'ACTIVE'
        console.log(`  - ${user.name} (${status}) [${user.id}]`)
    })

    console.log('\n=== Check Complete ===')
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
