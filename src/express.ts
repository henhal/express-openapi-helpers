import { Request, RequestHandler, Response } from 'express';

import { OpenApiRequestBody, OpenApiRequestParameters, OpenApiResponseBody } from './openapi.js';

export type Locals = Record<string, any>;

export type OpenApiRequestHandler<O, L extends Locals = Locals> =
  RequestHandler<OpenApiRequestParameters<O, 'path'>, OpenApiResponseBody<O>, OpenApiRequestBody<O>, OpenApiRequestParameters<O, 'query'>, L>;

export type OpenApiRequest<O, L extends Locals = Locals> =
  Request<OpenApiRequestParameters<O, 'path'>, OpenApiResponseBody<O>, OpenApiRequestBody<O>, OpenApiRequestParameters<O, 'query'>, L>;

export type OpenApiResponse<O, L extends Locals = Locals> =
  Response<OpenApiResponseBody<O>, L>;

export type JsonRequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj extends Locals> = (
  req: Request<P, ResBody, ReqBody, ReqQuery, LocalsObj>,
  res: Response<ResBody, LocalsObj>
) => ResBody | Promise<ResBody>;

export type OpenApiJsonRequestHandler<O, L extends Locals = Locals> = JsonRequestHandler<
  OpenApiRequestParameters<O, 'path'>,
  OpenApiResponseBody<O>,
  OpenApiRequestBody<O>,
  OpenApiRequestParameters<O, 'query'>,
  L>;

export function asJson<P, ResBody, ReqBody, ReqQuery, LocalsObj extends Locals>(
  handler: JsonRequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>
): RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj> {
  return (req, res, next) => {
    Promise.resolve(handler(req, res)).then(body => res.json(body), next);
  };
}

