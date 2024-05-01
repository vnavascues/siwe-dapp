import type { Profile } from "@prisma/client";

import type { ProfileData as szProfileData } from "../schemas";

export function serializeProfile(profile: Profile): szProfileData {
  return {
    id: profile.id,
    address: profile.address,
    name: profile.name,
    bio: profile.bio,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}
