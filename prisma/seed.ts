import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('ricardo', 10)

  const user = await prisma.user.upsert({
    where: { email: 'ric.lab3@gmail.com' },
    update: {},
    create: {
      email: 'ric.lab3@gmail.com',
      name: 'Admin User',
      password,
      role: 'ADMIN',
    },
  })

  const employee = await prisma.employee.upsert({
    where: { email: 'ric.lab3@gmail.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'ric.lab3@gmail.com',
      department: 'TI',
      access_level: 4,
      createdBy: 'SYSTEM',
    },
  })

  console.log({ user, employee })

  console.log({ user })
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
