import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function createUser(
  username: string,
  email: string,
  password: string
) {
  try {
    await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });
  } catch (error) {
    console.error("create user error", error);
    throw new Error(
      `Username '${username}' or email '${email}' already exists.`
    );
  }
}
