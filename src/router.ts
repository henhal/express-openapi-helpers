import { IRouter } from 'express';

import { Locals, OpenApiRequestHandler } from './express.js';
import { Path, PathMap, PathMethod } from './openapi.js';
import { isPromise, tap, toExpressRoute } from './utils.js';

type Logger = Pick<Console, 'debug' | 'info' | 'warn' | 'error'>;

interface Options {
  logger?: Logger;
}

export class OpenApiRouter<Paths extends PathMap<Paths>> {
  private readonly logger: Logger;

  constructor(readonly app: IRouter, {logger = console}: Options = {}) {
    this.logger = logger;
  }

  route<P extends Path<Paths>, M extends PathMethod<Paths[P]>, L extends Locals = Locals>(
    path: P,
    method: M,
    ...handlers: Array<OpenApiRequestHandler<Paths[P][M], L>>
  ): this {
    this.app[method](toExpressRoute(path), ...handlers.map(tap(result => {
      if (isPromise(result)) {
        this.logger.warn('Ignoring returned promise from handler; did you intend to wrap json handler?');
      }
    })));

    return this;
  }
}