<div align="center">
    <h1>Kenai</h1>
    <p>Creation and management of <strong>Fastify</strong> routes using decorators.</p>
    <p>
        <a href="https://www.npmjs.com/package/kenai"><img src="https://img.shields.io/npm/v/kenai?style=flat-square&maxAge=3600" alt="NPM version" /></a>
        <a href="https://www.npmjs.com/package/kenai"><img src="https://img.shields.io/npm/dt/kenai?style=flat-square&maxAge=3600" alt="NPM downloads" /></a>
        <a href="https://www.npmjs.com/package/kenai"><img src="https://img.shields.io/github/languages/code-size/isBucky/Kenai?style=flat-square&maxAge=3600" alt="NPM size" /></a>
        <a href="https://www.npmjs.com/package/kenai"><img src="https://img.shields.io/npm/l/kenai?style=flat-square&maxAge=3600" alt="NPM license" /></a>
  </p>
</div>

# Table of content

-   [**Installation**](#installation)
-   [**First steps**](#first-steps)
-   [**Decorators**](#decorators)
    -   [**Router**](#router)
    -   [**Middlewares**](#middlewares)
    -   [**BodySchema**](#bodyschema)
    -   [**QuerySchema**](#queryschema)
    -   [**ParamsSchema**](#paramsschema)
    -   [**Returns**](#returns)
    -   [**Methods**](#methods)
        -   [**Get**](#get)
        -   [**Post**](#post)
        -   [**Put**](#put)
        -   [**Patch**](#patch)
        -   [**Delete**](#delete)
    -   [**Params**](#params)
        -   [**Reply**](#reply)
        -   [**Request**](#request)
        -   [**Params**](#params-1)
        -   [**Body**](#body)
        -   [**Query**](#query)
        -   [**Headers**](#headers)
    -   [**Cache**](#cache)
        -   [**Cache**](#cache-1)
        -   [**Cache.InvalidateOnUpdate**](#cacheinvalidateonupdate)
    -   [**OpenAPI**](#openapi)
        -   [**Description**](#description)
        -   [**Summary**](#summary)
        -   [**Tags**](#tags)
        -   [**Consumes**](#consumes)
        -   [**Security**](#security)
        -   [**OperationId**](#operationid)
        -   [**Deprecated**](#deprecated)
        -   [**Hide**](#hide)
-   [**Extra**](#extra)

# Installation

```powershell
npm install kenai
```

# First steps

Before we start using the decorators, we need to configure **Kenai** as a **Fastify** plugin. Below are the plugin configuration options:

| Option                 | Description                                                                | Mandatory |
| ---------------------- | -------------------------------------------------------------------------- | --------- |
| `routers`              | Used to define new routes from this endpoint                               | Yes       |
| `zodCustomParser`      | Define a custom parser for Zod errors                                      | No        |
| `redis`                | Defines the Redis configuration for routes with cache                      | No        |
| `controllerParameters` | Defines the parameters for the controller class, such as the server itself | No        |

**Example of how to configure the plugin:**

```typescript
import MainRouter from './routers/';
import { KenaiPlugin } from 'kenai';
import fastify from 'fastify';

const app = fastify({ ignoreTrailingSlash: true });

app.register(KenaiPlugin, { mainRoute: MainRouter });

app.listen({ port: 3000 }, (err, address) => {
    if (err) throw err;
    console.log(`Server listening at ${address}`);
});
```

# Decorators

## Router

This decorator is responsible for creating routes in Fastify, allowing you to define middlewares, new routes, and controllers in a single call.

External routes defined inside the decorator body are automatically integrated, dynamically associating their URLs with the 'child' routes and this also applies to middlewares.

**Configuration options:**

| Option        | Description                                                | Mandatory |
| ------------- | ---------------------------------------------------------- | --------- |
| `routers`     | Used to define new routes from this endpoint               | Yes       |
| `middlewares` | Responsible for adding middleware to routes for validation | No        |
| `controllers` | Responsible for adding controllers to routes               | Yes       |

**Below is an example of how to create a route:**

```typescript
import { Router, Get } from 'kenai';

@Router('/hello-world')
export default class MainRouter {
    @Get()
    helloWorld() {
        return 'Hello World!';
    }
}
```

**Creating external routes and controllers:**

> Controllers are defined using the [**Methods**](#methods) decorators

```typescript
import { Router, Get } from 'kenai';

class HelloWorldController {
    @Get()
    helloWorld() {
        return 'Hello World!';
    }
}

// External route but interconnected, final url: /v1/hello-world
@Router('/hello-world', {
    controllers: [HelloWorldController]
});
class HelloWorldRouter {}

@Router('/v1', {
    routers: [HelloWorldRouter],
})
export default class MainRouter {}
```

## Middlewares

The middlewares are responsible for validating the requests, **being invoked before the main processing** and executed afterwards.

**Example of how to create a middleware:**

> You can add **more than one** middleware, just separate them with a comma.

```typescript
function ContentTypeValidator(request, reply, done) {
    if (request.headers['Content-Type'] !== 'application/json')
        throw new Error('Não aceito esse tipo de conteúdo');

    return done();
}

@Router('/')
class MainRouter {
    @Middleware(ContentTypeValidator)
    @Get()
    helloWorld() {
        return 'Hello World!';
    }
}
```

## BodySchema

This decorator is responsible for validating all data sent to the request body, using [Zod](https://github.com/colinhacks/zod) as a validation schema.

| Option            | Description                                                                      | Required |
| ----------------- | -------------------------------------------------------------------------------- | -------- |
| `schema`          | Defines the validation schema using zod                                          | Yes      |
| `omitUnknownKeys` | Defines whether the validator should remove keys that do not exist in the schema | No       |

**Example of how to use BodySchema:**

```typescript
import { BodySchema, Post } from 'kenai';
import { z } from 'zod';

class MainRouter {
    @BodySchema(z.object({ name: z.string().min(1) }))
    @Post()
    run(request) {}
}
```

## QuerySchema

This decorator is responsible for validating all data sent in the request URL, using [Zod](https://github.com/colinhacks/zod) as a validation schema.

> The schema created in zod must have all properties as optional, otherwise it will create errors for values that were not informed.

| Option            | Description                                                                      | Required |
| ----------------- | -------------------------------------------------------------------------------- | -------- |
| `schema`          | Defines the validation schema using zod                                          | Yes      |
| `omitUnknownKeys` | Defines whether the validator should remove keys that do not exist in the schema | No       |

**Example of how to use QuerySchema:**

```typescript
import { QuerySchema, Get } from 'kenai';
import { z } from 'zod';

class MainRouter {
    @QuerySchema(z.object({ name: z.string().min(1).optional() }))
    @Get()
    run(request) {}
}
```

## ParamsSchema

This decorator is responsible for validating all parameters passed in the Url of the request, using the [Zod](https://github.com/colinhacks/zod) as a validation schema.

| Option   | Description                             | Required |
| -------- | --------------------------------------- | -------- |
| `schema` | Defines the validation schema using zod | Yes      |

**Example of how to use the ParamsSchema:**

```typescript
import { ParamsSchema, Get } from 'kenai';
import { z } from 'zod';

class MainRouter {
    @ParamsSchema(z.object({ name: z.string().min(1) }))
    @Get()
    run(request) {}
}
```

## Returns

This decorator defines all possible returns of the request, defining the status and body of the response using [Zod](https://github.com/colinhacks/zod) as validation for the output.

| Option   | Description                             | Required |
| -------- | --------------------------------------- | -------- |
| `status` | Defines the status of the response      | Yes      |
| `schema` | Defines the validation schema using zod | No      |

**Example of how to use Returns:**

```typescript
import { Returns, Get } from 'kenai';
import { z } from 'zod';

class MainRouter {
    @Returns(200, z.object({ name: z.string().min(1) }))
    @Returns(201)
    @Get()
    run() {
        return { name: 'Kenai' };
    }
}
```

## Methods

The methods are responsible for creating the route controllers.

**All methods accept the same parameters:**

| Option                | Description                                                                                       | Required |
| --------------------- | ------------------------------------------------------------------------------------------------- | -------- |
| `path`                | Defines the route path                                                                            | Yes      |
| `fastifyRouteOptions` | Defines [Fastify route options](https://fastify.dev/docs/latest/Reference/Routes/#routes-options) | No       |

### Get

This decorator is responsible for creating a controller for a [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) route.

**Example of how to use Get:**

```typescript
import { Get } from 'kenai';

class MainRouter {
    @Get('/hello-world')
    helloWorld() {
        return 'Hello World!';
    }
}
```

### Post

This decorator is responsible for creating a controller for a [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) route.

**Example of how to use Post:**

```typescript
import { Post } from 'kenai';

class MainRouter {
    @Post('/hello-world')
    helloWorld() {
        return 'Hello World!';
    }
}
```

### Put

This decorator is responsible for creating a controller for a [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) route.

**Example of how to use Put:**

```typescript
import { Put } from 'kenai';

class MainRouter {
    @Put('/hello-world')
    helloWorld() {
        return 'Hello World!';
    }
}
```

### Patch

This decorator is responsible for creating a controller for a [PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH) route.

**Example of how to use Patch:**

```typescript
import { Patch } from 'kenai';

class MainRouter {
    @Patch('/hello-world')
    helloWorld() {
        return 'Hello World!';
    }
}
```

### Delete

This decorator is responsible for creating a controller for a [DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE) route.

**Example of how to use Delete:**

```typescript
import { Delete } from 'kenai';

class MainRouter {
    @Delete('/hello-world')
    helloWorld() {
        return 'Hello World!';
    }
}
```

## Params

The 'params' are responsible for creating custom parameters in the route handler.

**All 'params' accept these same parameters:**

| Option | Description                                            | Mandatory |
| ------ | ------------------------------------------------------ | --------- |
| `key`  | Name of some value that can be obtained in that object | Yes       |

### Reply

This decorator returns the entire response body.

**Example of how to use Reply:**

```typescript
import { Reply, Post } from 'kenai';

class MainRouter {
    @Post('/hello-world')
    helloWorld(@Reply() reply: FastifyReply) {
        return reply.code(401).send('Unauthorized');
    }
}

// Getting values within the request body

class MainRouter {
    @Post('/hello-world')
    helloWorld(@Reply('statusCode') statusCode: number) {
        return statusCode;
    }
}
```

### Request

This decorator returns the entire request object.

**Example of how to use Request:**

```typescript
import { Request, Post } from 'kenai';

class MainRouter {
    @Post('/hello-world')
    helloWorld(@Request() request: FastifyRequest) {
        return request;
    }
}

// Getting values within the request body

class MainRouter {
    @Post('/hello-world')
    helloWorld(@Request('body') body: any) {
        return body;
    }
}
```

### Params

This decorator returns all parameters of the request.

**Example of how to use the Params:**

```typescript
import { Params, Post } from 'kenai';

class MainRouter {
    @Post('/hello-world/:name')
    helloWorld(@Params() params: Record<string, string>) {
        return params;
    }
}
```

### Body

This decorator returns the entire request body.

**Example of how to use Body:**

```typescript
import { Body, Post } from 'kenai';

class MainRouter {
    @Post('/hello-world')
    helloWorld(@Body() body: any) {
        return body;
    }
}
```

### Query

This decorator returns all query parameters of the request.

**Example of how to use the Query:**

```typescript
import { Query, Post } from 'kenai';

class MainRouter {
    @Post('/hello-world')
    helloWorld(@Query() query: Record<string, string>) {
        return query;
    }
}
```

### Headers

This decorator returns all request headers.

**Example of how to use the Headers:**

```typescript
import { Headers, Post } from 'kenai';

class MainRouter {
    @Post('/hello-world')
    helloWorld(@Headers() headers: Record<string, string>) {
        return headers;
    }
}
```

## Cache

### Cache

This decorator allows you to store the result of a route in cache. This means that, when a request is made to this route, the results are stored in the cache and reused in the next request, thus saving response time.

> To enable the caching system, you must establish a connection with Redis in the Kenai configuration options (Plugin).

| Option | Description                                             | Required |
| ------ | ------------------------------------------------------- | -------- |
| `time` | Time in seconds that the result will be stored in cache | Yes      |

**Example of how to use the Cache:**

```typescript
import { Cache, Get } from 'kenai';

class MainRouter {
    @Get('/hello-world')
    @Cache(60)
    helloWorld() {
        return 'Hello World!';
    }
}
```

### Cache.InvalidateOnUpdate

This decorator allows you to invalidate the cache of a route whenever the stored content is updated. This means that, when calling the route, the corresponding cache will be automatically invalidated, ensuring that the next request returns updated data.

For example, I have a route that fetches all users from the database and another that updates a specific user. When I update a user, I want the cache to be invalidated so that I can have the updated data in the next request.

**Example of how to use the Cache.InvalidateOnUpdate:**

```typescript
import { Cache, Get } from 'kenai';

class MainRouter {
    @Post('/hello-world')
    @Cache.InvalidateOnUpdate()
    helloWorld() {
        return 'Hello World!';
    }
}
```

## OpenAPI

The decorators in this category are responsible for describing routes, automatically generating documentation with [Swagger](https://www.npmjs.com/package/@fastify/swagger-ui) from these descriptions.

Decorators such as [BodySchema](#bodyschema), [ParamsSchema](#paramsschema), [QuerySchema](#queryschema), and [Returns](#returns) accept [Zod](https://github.com/colinhacks/zod) as a validation schema. This allows you to define detailed descriptions for values using the `describe` function, or create complete specifications with the [zod-to-openapi](https://github.com/samchungy/zod-openapi) package.

### Description

This decorator defines a description about the route.

| Option        | Description         | Required |
| ------------- | ------------------- | -------- |
| `description` | Describes the route | Yes      |

**Example of how to use the Description:**

```typescript
import { Description, Get } from 'kenai';

class MainRouter {
    @Get('/hello-world')
    @Description('Hello World!')
    helloWorld() {
        return 'Hello World!';
    }
}
```

### Summary

This decorator defines a summary about the route.

| Option    | Description   | Required |
| --------- | ------------- | -------- |
| `summary` | Route summary | Yes      |

**Example of how to use the Summary:**

```typescript
import { Summary, Get } from 'kenai';

class MainRouter {
    @Get('/hello-world')
    @Summary('Hello World!')
    helloWorld() {
        return 'Hello World!';
    }
}
```

### Tags

This decorator defines tags for the route. Tags are very useful for organizing routes into logical categories, making the API documentation easier to understand and navigate.

| Option | Description | Required |
| ------ | ----------- | -------- |
| `tags` | Route tags  | Yes      |

**Example of how to use the Tags:**

```typescript
import { Tags, Get } from 'kenai';

class MainRouter {
    @Get('/hello-world')
    @Tags('Hello World')
    helloWorld() {
        return 'Hello World!';
    }
}
```

### Consumes

This decorator defines which types of content can be sent in the request. It is useful for specifying if the route only accepts `application/json`, for example.

| Option     | Description            | Required |
| ---------- | ---------------------- | -------- |
| `consumes` | Accepted content types | Yes      |

**Example of how to use the Consumes:**

```typescript
import { Consumes, Post } from 'kenai';

class MainRouter {
    @Post('/hello-world')
    @Consumes(['application/json'])
    helloWorld() {
        return 'Hello World!';
    }
}
```

### Security

This decorator defines which securities should be used to protect the route. It is useful for specifying if the route needs authentication, for example.

| Option     | Description      | Required |
| ---------- | ---------------- | -------- |
| `security` | Route securities | Yes      |

**Example of how to use the Security:**

```typescript
import { Security, Post } from 'kenai';

class MainRouter {
    @Post('/hello-world')
    @Security({ apiKey: [] })
    helloWorld() {
        return 'Hello World!';
    }
}
```

### OperationId

This decorator defines the name of an operation. It is useful for defining different names for operations in the same controller.

| Option        | Description    | Required |
| ------------- | -------------- | -------- |
| `operationId` | Operation name | Yes      |

**Example of how to use the OperationId:**

```typescript
import { OperationId, Get } from 'kenai';

class MainRouter {
    @Get('/hello-world')
    @OperationId('helloWorld')
    helloWorld() {
        return 'Hello World!';
    }
}
```

### Deprecated

This decorator defines if the route is deprecated. It is useful for marking routes that should not be used in production.

**Example of how to use the Deprecated:**

```typescript
import { Deprecated, Get } from 'kenai';

class MainRouter {
    @Get('/hello-world')
    @Deprecated
    helloWorld() {
        return 'Hello World!';
    }
}
```

### Hide

This decorator defines if the route should be hidden. It is useful for marking routes that should not be displayed in the API documentation.

**Example of how to use the Hide:**

```typescript
import { Hide, Get } from 'kenai';

class MainRouter {
    @Get('/hello-world')
    @Hide
    helloWorld() {
        return 'Hello World!';
    }
}
```

# Extra

## createParamsDecorator

Use this function to create decorators for route parameters. For example:

| Option | Description                                       | Required |
| ------ | ------------------------------------------------- | -------- |
| `path` | Initial path where the parameter will be obtained | Yes      |
| `key`  | Property name that you want to obtain             | No       |

```typescript
import { createParamsDecorator, Get } from 'kenai';

const Session = (key?: string) => createParamsDecorator('request/session', key);
// Or
const IP = createParamsDecorator('request/ip');

export class MainRouter {
    @Get('/')
    run(@Session() session: any, @IP ip: string) {
        return { session, ip };
    }
}
```
