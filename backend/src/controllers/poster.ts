import type { FastifyReply, FastifyRequest } from "fastify";

import type { PostPosterRequest } from "../schemas";
import { servePostPoster } from "../services/poster";

export async function postPosterController(request: FastifyRequest<{ Body: PostPosterRequest }>, reply: FastifyReply) {
  const { data, error, statusCode, success } = await servePostPoster(
    request.server.blockchain.provider,
    request.server.blockchain.signer,
    request.server.config.ADDRESS_POSTER,
    request.body.content,
    request.body.tag,
    request.server.log,
  );
  return reply.status(statusCode).send({ data, error, success });
}
