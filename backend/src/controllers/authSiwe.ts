import type { FastifyReply, FastifyRequest } from "fastify";
import { SiweMessage } from "siwe";

import { DateTimeUnit, getDateWithOffset } from "../libs/utils/datetime";
import type { PostSignInRequest } from "../schemas/authSiwe";
import { serveGetNonce, servePostSignIn } from "../services";

export async function getNonceController(request: FastifyRequest, reply: FastifyReply) {
  const { data, statusCode, success } = serveGetNonce();
  // @ts-expect-error: fix type
  request.session.nonce = data.nonce;
  return reply.status(statusCode).send({ data, success });
}

export async function postSignInController(request: FastifyRequest<{ Body: PostSignInRequest }>, reply: FastifyReply) {
  const { message, signature } = request.body;
  // @ts-expect-error: fix type
  const nonce = request.session.nonce;

  const { data, error, statusCode, success } = await servePostSignIn(message, signature, nonce, request.log);
  if (success) {
    request.session.cookie.expires = new Date(
      (data as SiweMessage).expirationTime ??
        getDateWithOffset(request.server.config.SESSION_EXPIRATION_IN_SECONDS, DateTimeUnit.SECOND),
    );
    // @ts-expect-error: fix type
    request.session.siwe = data;
  } else {
    // @ts-expect-error: fix type
    request.session.siwe = undefined;
    // @ts-expect-error: fix type
    request.session.nonce = undefined;
  }
  request.session.save(() => reply.status(statusCode).send({ success, data, error }));
}

export async function deleteSignOffController(request: FastifyRequest, reply: FastifyReply) {
  // @ts-expect-error: fix type
  request.session.siwe = undefined;
  // @ts-expect-error: fix type
  request.session.nonce = undefined;
  return reply.status(200).send({ success: true });
}
