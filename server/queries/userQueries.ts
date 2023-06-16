import { prisma } from "../index";
import { getProfileByEmail, getProfileById } from "./profileQueries";

export async function createUser(
  username: string,
  email: string,
  password: string,
  registeredWith: string,
  usernameSet: boolean
) {
  try {
    await prisma.user.create({
      data: {
        username,
        email,
        password,
        registeredWith,
        usernameSet,
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
  const user: any = await getProfileByEmail(email);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { picture: newPic },
  });

  return updatedUser;
}

export async function updateUserName(email: string, newUsername: string) {
  const user: any = await getProfileByEmail(email);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { username: newUsername },
  });

  return updatedUser;
}

export async function getPaymentTypeById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user?.paymentType;
}

export async function updateUserUsernameSet(
  userId: number,
  usernameSet: boolean
) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { usernameSet },
  });

  return updatedUser;
}
