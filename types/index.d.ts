import { FastifyReply, FastifyRequest, RouteHandler } from 'fastify';
import { preValidationMetaHookHandler } from 'fastify/types/hooks';

export type FastifyHandler = RouteHandler;
export type FastifyValidation = preValidationMetaHookHandler;
