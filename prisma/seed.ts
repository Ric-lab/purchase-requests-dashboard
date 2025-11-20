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
