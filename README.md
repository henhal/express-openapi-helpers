# express-openapi-helpers
OpenAPI typed express router and operation resolver for express-openapi-validator

This library assumes that the client has generated types from an OpenAPI specification using `openapi-typescript`.
If the client also uses `express-openapi-validator`, this package offers a type-safe way to define and register the OpenAPI operations.

### Features
- OpenAPI-typed Express request types (Request, Response, RequestHandler etc)
- Typed express router, enabling adding routes using Express syntax but with type-safe routes from the OpenAPI specification
- Typed operation resolver to be used together with `express-openapi-validator`

### Installation

`npm install express-openapi-helpers`

Also assumes using `openapi-typescript` to generate types from an OpenAPI specification, e.g.:

`npx openapi-typescript api/my-api.yml -o src/gen/my-api.d.ts`

### Usage

#### Router

```
import { paths } from './gen/my-api.d.ts';
import { OpenApiRouter } from 'express-openapi-helpers';
const app = express();

new OpenApiRouter<paths>(app)
  .route('/pets/{petId}', 'get', (req, res) => {
    // ...
  })
  .route('/pets', 'get', (req, res) => {
    // ...
  })
  .route('/pets', 'post', (req, res) => {
    // ...
  });
```

All of these request handlers will be typed correctly using the 
`OpenApiRequest` types etc, that infers types for the path and method using the OpenAPI specification.

#### Operation Resolver

```
import { openApiResolver, OperationHandlers } from 'express-openapi-helpers';
import { operations } from './gen/my-api.d.ts';

const operations: OperationHandlers<operations> = {
  getPetById: (req, res) => {
    // ...
  },
  getPets: (req, res) => {
    // ...
  },
  createPet: (req, res) => {
    // ...
  },
};

app.use(OpenApiValidator.middleware({
  apiSpec: path.join(__dirname, '../my-api.yml'),
  operationHandlers: openApiResolver(operations),
));
```

Alternatively, you can use the `OpenApiResolver` class to define and register the operations:

```
import { OpenApiResolver } from 'express-openapi-helpers';
import { operations } from './gen/my-api.d.ts';

const resolver = new OpenApiResolver<operations>()
  .operation('getPetById', (req, res) => {
    // ...
  })
  .operation('getPets', (req, res) => {
    // ...
  })
  .operation('createPet', (req, res) => {
    // ...
  })
  .resolver();
  
app.use(OpenApiValidator.middleware({
  apiSpec: path.join(__dirname, '../my-api.yml'),
  operationHandlers: resolver,
));
```

