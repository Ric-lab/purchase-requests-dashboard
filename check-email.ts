import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('=== Checking User and Employee for maria.silva@empresa.com ===\n')

    const employees = await prisma.employee.findMany({
        where: { email: 'maria.silva@empresa.com' },
        select: { id: true, name: true, email: true, deletedAt: true }
    })

    console.log('Employees with this email:')
    employees.forEach(emp => {
        const status = emp.deletedAt ? '(DELETED)' : '(ACTIVE)'
        console.log(`- ${emp.name} ${status}`)
    })

    const users = await prisma.user.findMany({
        where: { email: 'maria.silva@empresa.com' },
        select: { id: true, name: true, email: true, deletedAt: true }
    })

    console.log('\nUsers with this email:')
    users.forEach(user => {
        const status = user.deletedAt ? '(DELETED)' : '(ACTIVE)'
        console.log(`- ${user.name} ${status}`)
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
