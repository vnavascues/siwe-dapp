import type { PrismaClient } from "@prisma/client";

import type { PatchProfileRequest, PostProfileRequest } from "../schemas";

export async function dbQueryProfileByAddress(prismaClient: PrismaClient, address: string) {
  return prismaClient.profile.findUnique({ where: { address: address } });
}

export async function dbInsertProfile(prismaClient: PrismaClient, data: PostProfileRequest & { address: string }) {
  return prismaClient.profile.create({ data });
}

export async function dbUpdateProfile(prismaClient: PrismaClient, id: string, data: PatchProfileRequest) {
  return prismaClient.profile.update({ where: { id }, data });
}

export async function dbDeleteProfile(prismaClient: PrismaClient, id: string) {
  return prismaClient.profile.delete({ where: { id } });
}
