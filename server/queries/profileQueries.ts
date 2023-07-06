import { prisma } from "../index";

export async function getProfileById(id: number) {
  const userProfile = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      usernameSet: true,
      paymentType: true,
      email: true,
      picture: true,
      registeredWith: true,

      friends: {
        select: {
          id: true,
          username: true,
          picture: true,
        },
      },
      friendRequests: {
        select: {
          id: true,
          username: true,
          picture: true,
        },
      },
      friendRequestsSent: {
        select: {
          id: true,
          username: true,
          picture: true,
        },
      },
      friendOf: {
        select: {
          id: true,
          username: true,
          picture: true,
        },
      },
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
        friends: {
          select: {
            id: true,
            username: true,
            picture: true,
          },
        },
        friendRequests: {
          select: {
            id: true,
            username: true,
            picture: true,
          },
        },
        friendRequestsSent: {
          select: {
            id: true,
            username: true,
            picture: true,
          },
        },
        friendOf: {
          select: {
            id: true,
            username: true,
            picture: true,
          },
        },
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
