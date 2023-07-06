import { prisma } from "../index";

export async function getPaymentTypeById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user?.paymentType;
}

export async function updatePaymentTypeById(id: number, paymentType: string) {
  const user = await prisma.user.update({
    where: { id },
    data: {
      paymentType,
    },
  });
  return user;
}
