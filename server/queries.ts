import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

async function createUser(username: string, email: string, password: string) {
  await prisma.user.create({
    data: {
      username,
      email,
      password
    },
  })
}

// createUser("garv", "garv@gmail.com", "123")

export default async function getProfile(username: string) {
    const userProfile = await prisma.user.findUniqueOrThrow({
      where: {
        username: username,
      }
    })
    if (userProfile) {
      return userProfile
    } else {
      console.log("Profile not found.")
    }
  }
  
  // getProfile("")
  //   .then(async (e) => {
  //     console.log(e)
  //     await prisma.$disconnect()
  //   })
  //   .catch(async (e) => {
  //     console.error(e)
  //     await prisma.$disconnect()
  //     process.exit(1)
  //   })
