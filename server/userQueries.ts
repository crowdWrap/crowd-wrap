import { PrismaClient } from "@prisma/client";
import { getProfileById, getProfileByUsername } from "./profileQueries";

export const prisma = new PrismaClient();

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

//so to remove friendRequest received you would not only have to remove the person from the current user
//friendrequest you would also have to go to the one that sent it and remove the sent one

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

export async function createEvent(
  id: number,
  eventInfo: any,
  inviteLink: string
) {
  try {
    const user = await getProfileById(id);
    await prisma.event.create({
      data: {
        title: eventInfo.title,
        description: eventInfo.description,
        inviteLink: inviteLink,
        ownerId: id,
        moneyGoal: eventInfo.moneyGoal,
        Currentfunds: 0,
        image: eventInfo.img,
        deadlineDate: eventInfo.date,
        deadlineTime: eventInfo.time,
        participants: {
          create: {
            userId: id,
            picture: user.picture,
            username: user.username,
            currentMoney: 0,
          },
        },
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function removeEvent(eventId: number) {
  try {
    await prisma.event.deleteMany({
      where: { id: eventId },
    });
  } catch (e) {
    throw e;
  }
}

export async function removeParticipant(id: number, eventId: number) {
  const participant = await prisma.eventToUser.findFirst({
    where: {
      userId: id,
      eventId,
    },
  });

  if (!participant) {
    throw new Error(`User ${id} is not a participant in event ${eventId}`);
  }

  await prisma.eventToUser.delete({
    where: {
      id: participant.id,
    },
  });
}

export async function addParticipant(id: number, eventId: number) {
  try {
    const participantExists = await prisma.eventToUser.findFirst({
      where: {
        userId: id,
        eventId,
      },
    });

    if (participantExists) {
      console.log(`User ${id} is already a participant in event ${eventId}`);
    }

    const user = await getProfileById(id);

    await prisma.eventToUser.create({
      data: {
        user: {
          connect: { id },
        },
        event: {
          connect: { id: eventId },
        },
        picture: user.picture,
        username: user.username,
      },
    });
  } catch (e) {
    console.log(e);
  }
}

export async function getEventById(id: number) {
  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      participants: true,
    },
  });
  if (event) {
    return event;
  } else {
    console.log("event not found.");
    throw new Error(`event '${id}' doesn't exist.`);
  }
}

export async function getEventByLink(link: string) {
  const event = await prisma.event.findUnique({
    where: {
      inviteLink: link,
    },
  });
  if (event) {
    return event;
  } else {
    return null;
  }
}
export async function isParticipantInEvent(id: number, eventId: number) {
  const participantExists = await prisma.eventToUser.findFirst({
    where: {
      userId: id,
      eventId,
    },
  });

  if (participantExists) {
    return true;
  } else {
    return false;
  }
}

//THis isnt working and is essentially always false I think?
