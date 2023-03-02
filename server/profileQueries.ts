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
  const userProfile = await prisma.user.findUniqueOrThrow({
    where: {
      username,
    },
  });
  if (userProfile) {
    return userProfile;
  } else {
    console.log("Profile not found.");
    throw new Error(`Profile '${username}' doesn't exist.`);
  }
}

export async function getProfileByEmail(email: string) {
  const userProfile = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });
  if (userProfile) {
    console.log("IN QUERY PROFILE: ", userProfile);
    return userProfile;
  } else {
    console.log("Profile not found.");
    throw new Error(`Profile '${email}' doesn't exist.`);
  }
}
