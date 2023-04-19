import { prisma } from "./userQueries";

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

export async function getFriendsByPartialUsername(
  partialUsername: string,
  userId: number
) {
  //current user = userId
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { friends: true },
    });

    const matchingFriends = user?.friends.filter((friend) =>
      friend.username.toLowerCase().includes(partialUsername.toLowerCase())
    );
    return matchingFriends;
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

//Move to userqueries

export async function updateUser(email: string, newPic: string) {
  const user = await getProfileByEmail(email);
  console.log(user);
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { picture: newPic },
  });

  console.log(updatedUser);
  return updatedUser;
}

export async function updateUserName(email: string, newUsername: string) {
  const user = await getProfileByEmail(email);
  console.log(user);
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { username: newUsername },
  });

  console.log(updatedUser);
  return updatedUser;
}
