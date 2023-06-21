import { prisma } from "../index";
import { getProfileById } from "./profileQueries";

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
    await prisma.event.delete({
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
        currentMoney: 0,
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
      participants: {
        orderBy: {
          joinedAt: "asc",
        },
      },
    },
  });
  if (event) {
    return event;
  } else {
    return null;
  }
}

export async function getAllEventsByid(id: number) {
  const events = await prisma.eventToUser.findMany({
    where: {
      userId: id,
    },
    include: {
      event: {
        include: {
          participants: {
            orderBy: {
              joinedAt: "asc",
            },
          },
        },
      },
    },
    orderBy: {
      event: {
        createdAt: "desc",
      },
    },
  });

  return events.map((e) => e.event);
}

export async function getEventByLink(link: string) {
  const event = await prisma.event.findUnique({
    where: {
      inviteLink: link,
    },
    include: {
      participants: true,
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

export async function getParticipantById(id: number) {
  const userProfile = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      friends: false,
      friendRequests: false,
      friendRequestsSent: false,
      friendOf: false,
      events: false,
      ownedEvents: false,
    },
  });
  if (userProfile) {
    return { pic: userProfile.picture, id };
  } else {
    console.log("Profile not found.");
    throw new Error(`Profile '${id}' doesn't exist.`);
  }
}

export async function updateEventCurrentFunds(
  eventId: number,
  currentMoney: number
) {
  const event = await getEventById(eventId);

  if (event) {
    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        Currentfunds: event?.Currentfunds + currentMoney,
      },
    });
    return updatedEvent;
  } else {
    throw new Error(`${eventId} doesnt exist`);
  }
}
