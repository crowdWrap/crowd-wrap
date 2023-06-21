import { prisma } from "../index";

export async function createMessage(
  userId: number,
  eventId: number,
  content: string
) {
  try {
    const newMessage = await prisma.message.create({
      data: {
        userId,
        eventId,
        content,
      },
    });
    return newMessage;
  } catch (e) {
    throw e;
  }
}

export async function removeMessages(eventId: number) {
  try {
    await prisma.message.deleteMany({
      where: { eventId: eventId },
    });
  } catch (e) {
    throw e;
  }
}

export async function getMessagesById(eventId: number) {
  try {
    const message = await prisma.message.findMany({
      where: {
        eventId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return message;
  } catch (e) {
    throw e;
  }
}
