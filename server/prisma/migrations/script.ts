// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// async function main() {
//     const user = await prisma.user.create({
//         data: {
//           name: 'Bob',
//           email: 'bob@prisma.io',
//           password: 'pass'  // Modify to get all data from frontend client
//         },
//       })
//       console.log(user) 

//     const users = await prisma.user.findMany()
//     console.log(users)
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })