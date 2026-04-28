export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export type Content = Record<string, unknown>;

export type ParameterType = 'query' | 'path' | 'header' | 'cookie';

export interface Operation {
  parameters?: Partial<Record<ParameterType, unknown>>;
  requestBody?: {
    content: Content;
  };
  responses?: Record<string | number, {
    content?: Content;
  }>;
}

export type PathItem = Partial<Record<HttpMethod, Operation>>;

export type PathMap<T> = Record<keyof T, PathItem>;

export type PathMethod<T extends PathItem> = {
  [K in HttpMethod]: T[K] extends Operation ? K : never;
}[HttpMethod];

export type Path<T extends PathMap<T>> = Extract<keyof T, string>;

export type OperationMap<T> = Record<keyof T, Operation>;
export type OperationId<T extends OperationMap<T>> = Extract<keyof T, string>;

// ---

export type OpenApiRequestParameters<O, T extends ParameterType> = O extends {
  parameters: {
    [P in T]?: infer P;
  }
} ? P : Record<string, never>;

export type OpenApiRequestBodyContentType<O> = O extends {
  requestBody: {
    content: Record<infer T, unknown>;
  }
} ? T : never;

export type OpenApiRequestBody<O, T extends OpenApiRequestBodyContentType<O> = OpenApiRequestBodyContentType<O>> = O extends {
  requestBody: {
    content: Record<T, infer C>;
  }
} ? C : undefined;

export type OpenApiResponseStatus<O> = O extends {
  responses: Record<infer S, unknown>;
} ? S : never;

export type OpenApiResponseContentType<O, S extends OpenApiResponseStatus<O>> = O extends {
  responses: Record<S, {
    content: Record<infer T, unknown>;
  }>;
} ? T : never;

export type OpenApiResponseBody<O, S extends OpenApiResponseStatus<O> = OpenApiResponseStatus<O>, T extends OpenApiResponseContentType<O, S> = OpenApiResponseContentType<O, S>> = O extends {
  responses: Record<S, {
    content: Record<T, infer C>;
  }>;
} ? C : undefined;