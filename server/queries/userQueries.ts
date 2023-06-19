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

export async function updateUserCurrentFunds(
  eventId: number,
  userId: number,
  currentMoney: number
) {
  const user: any = await prisma.eventToUser.findFirst({
    where: {
      userId,
      eventId,
    },
  });

  if (user) {
    const updateFunds = prisma.eventToUser.update({
      where: { id: user?.id },
      data: {
        currentMoney: user?.currentMoney + currentMoney,
      },
    });
    return updateFunds;
  } else {
    throw new Error(`User ${userId} is not a participant in event ${eventId}`);
  }
}
