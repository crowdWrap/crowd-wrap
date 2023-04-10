import { prisma } from "./userQueries";

export async function getProfileById(id: number) {
  const userProfile = await prisma.user.findUniqueOrThrow({
    where: {
      id,
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
    });
    if (userProfile) {
      return userProfile;
    }
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

export async function updateUser(email: string, newPic: string) {
  const user = await getProfileByEmail(email);
  console.log(user);
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { pictureUrl: newPic },
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
