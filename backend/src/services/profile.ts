import type { PrismaClient } from "@prisma/client";

import { dbDeleteProfile, dbInsertProfile, dbQueryProfileByAddress, dbUpdateProfile } from "../queries";
import type { PatchProfileRequest, PostProfileRequest } from "../schemas";
import { serializeProfile } from "../serializers";
import type { Service } from "./types";

export async function serveGetProfile(prismaClient: PrismaClient, address: string): Promise<Service> {
  const profile = await dbQueryProfileByAddress(prismaClient, address);
  if (profile) {
    return {
      data: serializeProfile(profile),
      success: true,
      statusCode: 200,
    };
  }
  return {
    error: { type: "address profile not found", received: address },
    success: false,
    statusCode: 404,
  };
}

export async function servePostProfile(
  prismaClient: PrismaClient,
  address: string,
  data: PostProfileRequest,
): Promise<Service> {
  // NB: remove this validation once `noEmptyString` AJV custom format is enabled
  if (!data.name.trim().length) {
    return {
      error: { type: "body/name must be non-empty string", received: data.bio as string },
      success: false,
      statusCode: 400,
    };
  }

  // NB: remove this validation once `noEmptyString` AJV custom format is enabled
  if (typeof data.bio === "string" && !data.bio.trim().length) {
    return {
      error: { type: "body/bio must be non-empty string", received: data.bio as string },
      success: false,
      statusCode: 400,
    };
  }

  let profile = await dbQueryProfileByAddress(prismaClient, address);
  if (profile) {
    return {
      error: { type: "address profile already exists", received: address },
      success: false,
      statusCode: 409,
    };
  }
  profile = await dbInsertProfile(prismaClient, { address, ...data });
  return {
    data: serializeProfile(profile),
    success: true,
    statusCode: 201,
  };
}

export async function servePatchProfile(
  prismaClient: PrismaClient,
  address: string,
  data: PatchProfileRequest,
): Promise<Service> {
  // NB: remove this validation once `noEmptyString` AJV custom format is enabled
  if (data.name !== undefined && !data.name.trim().length) {
    return {
      error: { type: "body/name must be non-empty string", received: data.bio as string },
      success: false,
      statusCode: 400,
    };
  }

  // NB: remove this validation once `noEmptyString` AJV custom format is enabled
  if (typeof data.bio === "string" && !data.bio.trim().length) {
    return {
      error: { type: "body/bio must be non-empty string", received: data.bio as string },
      success: false,
      statusCode: 400,
    };
  }

  let profile = await dbQueryProfileByAddress(prismaClient, address);
  if (!profile) {
    return {
      error: { type: "address profile not found", received: address },
      success: false,
      statusCode: 404,
    };
  }
  profile = await dbUpdateProfile(prismaClient, profile.id, data);
  return {
    data: serializeProfile(profile),
    success: true,
    statusCode: 200,
  };
}

export async function serveDeleteProfile(prismaClient: PrismaClient, address: string): Promise<Service> {
  let profile = await dbQueryProfileByAddress(prismaClient, address);
  if (!profile) {
    return {
      error: { type: "address profile not found", received: address },
      success: false,
      statusCode: 404,
    };
  }
  profile = await dbDeleteProfile(prismaClient, profile.id);
  return {
    statusCode: 204,
  };
}
