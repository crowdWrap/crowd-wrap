import { prisma } from "../index";
import { getProfileByEmail } from "./profileQueries";

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
        picture:
          "https://vectorified.com/images/no-profile-picture-icon-28.png",
        friends: {
          connect: [],
        },
        friendRequests: {
          connect: [],
        },
        ownedEvents: {
          create: [],
        },
        events: {
          create: [],
        },
      },
    });
  } catch (error) {
    console.error("create user error", error);
    throw new Error(
      `Username '${username}' or email '${email}' already exists.`
    );
  }
}

export async function updateUser(email: string, newPic: string) {
  const user = await getProfileByEmail(email);

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { picture: newPic },
  });

  return updatedUser;
}

export async function updateUserName(email: string, newUsername: string) {
  const user = await getProfileByEmail(email);

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { username: newUsername },
  });

  return updatedUser;
}
