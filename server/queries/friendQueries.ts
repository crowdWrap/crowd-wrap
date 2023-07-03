import { prisma } from "../index";
import { getProfileById, getProfileByUsername } from "./profileQueries";

export async function updateFriendRequest(username: string, id: number) {
  try {
    const sentUser = await getProfileById(id);
    const updatedUser = await prisma.user.update({
      where: { username: username },
      data: {
        friendRequests: {
          connect: [
            {
              username: sentUser?.username,
            },
          ],
        },
      },
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export async function updateFriendRequestSent(username: string, id: number) {
  try {
    const receivingUser = await getProfileByUsername(username);
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        friendRequestsSent: {
          connect: [
            {
              username: receivingUser?.username,
            },
          ],
        },
      },
    });
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

export async function removeFriendSent(username: string, id: number) {
  try {
    //username = the person that sent, and the id = the current user.
    const sentUser = await getProfileByUsername(username);
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        friendRequestsSent: {
          disconnect: [
            {
              id: sentUser?.id,
            },
          ],
        },
      },
    });
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

export async function removeFriendReceived(username: string, id: number) {
  try {
    //username = user to remove friend received from, id = user who sent the request and who to remove
    const sentUser = await getProfileById(id);
    const updatedUser = await prisma.user.update({
      where: { username: username },
      data: {
        friendRequests: {
          disconnect: [
            {
              id: sentUser.id,
            },
          ],
        },
      },
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export async function addFriend(username: string, id: number) {
  try {
    //username = the person who sent it, and the id =  the current user
    const receivingUser = await getProfileById(id);
    const sentUser = await getProfileByUsername(username);
    const updatedCurrentUser = await prisma.user.update({
      where: { id: id },
      data: {
        friends: {
          connect: [
            {
              username: sentUser?.username,
            },
          ],
        },
      },
    });
    const updatedOppositeUser = await prisma.user.update({
      where: { id: sentUser?.id },
      data: {
        friends: {
          connect: [
            {
              username: receivingUser?.username,
            },
          ],
        },
      },
    });

    return { updatedCurrentUser, updatedOppositeUser };
  } catch (error) {
    throw error;
  }
}

export async function removeFriend(username: string, id: number) {
  try {
    //username = the person who sent it, and the id =  the current user
    const receivingUser = await getProfileById(id);
    const sentUser = await getProfileByUsername(username);
    const updatedCurrentUser = await prisma.user.update({
      where: { id: id },
      data: {
        friends: {
          disconnect: [
            {
              username: sentUser?.username,
            },
          ],
        },
      },
    });
    const updatedOppositeUser = await prisma.user.update({
      where: { id: sentUser?.id },
      data: {
        friends: {
          disconnect: [
            {
              username: receivingUser?.username,
            },
          ],
        },
      },
    });

    return { updatedCurrentUser, updatedOppositeUser };
  } catch (error) {
    throw error;
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
      include: {
        friends: {
          select: {
            id: true,
            username: true,
            picture: true,
          },
        },
      },
    });

    const matchingFriends = user?.friends.filter((friend) =>
      friend.username.toLowerCase().includes(partialUsername.toLowerCase())
    );
    return matchingFriends;
  } catch (e) {
    console.log(e);
  }
}
