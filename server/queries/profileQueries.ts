import { prisma } from "../index";

export async function getProfileById(id: number) {
  const userProfile = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      friends: true,
      friendRequests: true,
      friendRequestsSent: true,
      friendOf: true,
      events: true,
      ownedEvents: true,
    },
  });
  if (userProfile) {
    return userProfile;
  } else {
    console.log("Profile not found.");
    throw new Error(`Profile '${id}' doesn't exist.`);
  }
}

export async function getProfileByUsername(username: string) {
  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        friends: true,
        friendRequests: true,
        friendRequestsSent: true,
        friendOf: true,
        events: true,
        ownedEvents: true,
      },
    });
    if (userProfile) {
      return userProfile;
    }
  } catch (e) {
    console.log(e);
  }
}

export async function getProfilesByPartialUsername(partialUsername: string) {
  try {
    const userProfiles = await prisma.user.findMany({
      where: {
        username: {
          contains: partialUsername,
          mode: "insensitive",
        },
      },
    });
    return userProfiles;
  } catch (e) {
    console.log(e);
  }
}

export async function getProfileByEmail(email: string) {
  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userProfile) {
      return userProfile;
    }
  } catch (e) {
    console.log(e);
  }
}
