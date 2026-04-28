import {OperationHandlerOptions} from 'express-openapi-validator/dist/framework/types.js';
import { asJson, OpenApiJsonRequestHandler } from './express.js';
import { HttpMethod, OperationId, OperationMap } from './openapi.js';

export type OperationHandlers<Operations extends OperationMap<Operations>> = {
  [O in OperationId<Operations>]: OpenApiJsonRequestHandler<Operations[O]>;
};

export function openApiResolver<Operations extends OperationMap<Operations>>(
  handlers: Partial<OperationHandlers<Operations>>,
  basePath = ''
): OperationHandlerOptions {
  return {
    basePath,
    resolver: (_, route, {paths}) => {
      const { basePath, openApiRoute, method } = route;
      const operationId = paths?.[openApiRoute.substring(basePath.length)]?.[method.toLowerCase() as HttpMethod]?.operationId;
      const handler = operationId && handlers[operationId as OperationId<Operations>];

      return handler ? asJson(handler) : () => {
        throw Object.assign(new Error(`Not implemented: ${openApiRoute}`), {
          status: 501,
          name: 'Not implemented',
          path: openApiRoute
        });
      };
    }
  };
}

export class OpenApiResolver<Operations extends OperationMap<Operations>> {
  private readonly handlers: Partial<OperationHandlers<Operations>>;

  constructor(handlers?: OperationHandlers<Operations>) {
    this.handlers = handlers || {};
  }

  operation<O extends OperationId<Operations>>(
    operationId: O,
    handler: OpenApiJsonRequestHandler<Operations[O]>
  ): this {
    this.handlers[operationId] = handler;

    return this;
  }

  resolver(basePath = ''): OperationHandlerOptions {
    return openApiResolver(this.handlers, basePath);
  }
}

