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

export async function updateUser(id: number, newPic: string) {
  const user = await getProfileById(id);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { picture: newPic },
  });

  return updatedUser;
}
