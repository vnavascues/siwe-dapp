import type { FastifyReply, FastifyRequest } from "fastify";

import type { PatchProfileRequest, PostProfileRequest } from "../schemas";
import { serveDeleteProfile, serveGetProfile, servePatchProfile, servePostProfile } from "../services/profile";

export async function getProfileController(request: FastifyRequest, reply: FastifyReply) {
  const { data, error, statusCode, success } = await serveGetProfile(
    request.server.prisma,
    // @ts-expect-error: fix type
    request.session.siwe.address,
  );
  return reply.status(statusCode).send({ data, error, success });
}

export async function postProfileController(
  request: FastifyRequest<{ Body: PostProfileRequest }>,
  reply: FastifyReply,
) {
  const { data, error, statusCode, success } = await servePostProfile(
    request.server.prisma,
    // @ts-expect-error: fix type
    request.session.siwe.address,
    request.body,
  );
  return reply.status(statusCode).send({ data, error, success });
}

export async function patchProfileController(
  request: FastifyRequest<{ Body: PatchProfileRequest }>,
  reply: FastifyReply,
) {
  const { data, error, statusCode, success } = await servePatchProfile(
    request.server.prisma,
    // @ts-expect-error: fix type
    request.session.siwe.address,
    request.body,
  );
  return reply.status(statusCode).send({ data, error, success });
}

export async function deleteProfileController(request: FastifyRequest, reply: FastifyReply) {
  const { data, error, statusCode, success } = await serveDeleteProfile(
    request.server.prisma,
    // @ts-expect-error: fix type
    request.session.siwe.address,
  );
  return reply.status(statusCode).send({ data, error, success });
}
