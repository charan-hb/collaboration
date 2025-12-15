import { prisma } from "../prisma";

export const userRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
    }),
  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
    }),
  create: (data: { email: string; name: string; password: string }) =>
    prisma.user.create({ data }),
  updateName: (id: string, name: string) =>
    prisma.user.update({ where: { id }, data: { name } }),
};


