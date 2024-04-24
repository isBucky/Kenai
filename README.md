<div align="center">
    <h1>Kenai</h1>
    <p>Creation and management of <strong>Fastify</strong> routes using decorators.</p>
</div>

# Table of content

- [**Installation**](#installation)
- [**First steps**](#first-steps)
- [**LoadRoutes**](#loadroutes)
- [**Router**](#router)
- [**Docs**](#docs)
- [**Metadata**](#metadata)
- [**Cache**](#cache)
    - [**Cache.delete**](#cachedelete)
    - [**Cache.initialize**](#cacheinitialize)
- [**Methods**](#methods)
- [**Params**](#params)
- [**Extra**](#extra)
    - [**Controllers**](#controllers)
    - [**Validations**](#validations)
    - [**Criar Decorators Para Métodos**](#)
    - [**Criar Decorators Para Parâmetros**](#)


# Installation

NPM:
```powershell
npm install kenai
```

Yarn:
```powershell
yarn add kenai
```

Pnpm:
```powershell
pnpm add kenai
```

# First steps

Below is an example of how to use decorators to create your routes, the creation of routes **is based on the main route** and for **every sub-route there must be a main route**, just like the route `/users` must belong to the `/` route (main) and each route can have **controllers in separate folders** as in the [**Click here**](https://github.com/isBucky/Kenai/tree/main/examples/several-routes) example, thus **not polluting your code** creating several functions in a route class.

> **Note** To learn more about these features read [LoadRoutes](#loadroutes) and [Router](#router).


**Example de única rota:**
```typescript
import { Router, LoadRoutes } from 'kenai';
import { Get } from 'kenai/methods';
import fastify from 'fastify';

const app = fastify();

@Router()
class FirstRouter {
    @Get()
    GetRouter() {
        return {
            message: 'Hello World!',
        };
    }
}

LoadRoutes({
    app,
    mainRoute: FirstRouter,
}).then((routes) => {
    if (!routes) return console.log('No routes to carry');

    app.listen({ port: 3000 }, () => console.log('on'));
});
```


# LoadRoutes

You must use this function to load all routes created by decorators.

**Parameters:**

```typescript
{
    /**
     * Fastify application instance
     */
    app: FastifyInstance;

    /**
     * Main route of your application
     */
    mainRoute?: new (...args: any[]) => any;

    /**
     * This option is used to define the parameters of all routes
     */
    controllerParameters?: any[];
}
```

**Example:**

```typescript
LoadRoutes({
    app: FastifyApp,
    mainRoute: MainRoute,
    controllerParameters: ['foo', 'bar']
});
```

# Router

Use this decorator to create new routes on the Fastify server.

**Parameters:**

**Path:** Path that the route will be created. It's not mandatory.

**Options:**

> **Note** Learn more about [Controllers](#controllers) and [Validations](#validations).

```typescript
{
    /**
     * Controllers responsible for this route
     */
    controllers?: (new (...args: any[]) => unknown)[];

    /**
     * All routes defined in this router will have automatically defined validations
     */
    validations?: Validation[];

    /**
     * Use to make a list of other routes with the current
     */
    routes?: (new (...args: any[]) => unknown)[];
}
```

**Example:**

```typescript
@Router('/users', {
    controllers: [GetUsers, Register],
    validations: [UserValidation],
    routes: [OtherRoute]
})
class MyRoute {}

// Or

@Router({
    controllers: [GetUsers, Register],
    validations: [UserValidation],
    routes: [OtherRoute]
})
class MyRoute {}
```

# Docs

Use this route to define an object containing information about the route, so you can create custom docs.

**Parameters:**

```typescript
{
    path: string;
    method: string;

    description?: string;
    consumes?: string[];
    permissions?: string[];
    security?: string[];
    tag?: string;

    request?: {
        query?: object;
        body?: any;
    };

    responses?: {
        status?: number;
        produce?: string;
        content?: any;
    }[];
}
```

**Example:**

```typescript
class MyController {
    @Docs({
        path: '/',
        method: 'get',
    
        description: 'Description',
        consumes: ['application/json'],
        permissions: ['admin'],
        tag: ['main'],
    })
    @Get()
    myHandler() {}
}
```


# Metadata

Use this decorator to define preferred values for the route.

**Parameters:**

The parameter value can be anything to be set.

**Example:**

```typescript
class MyController {
    @Metadata({
        foo: 'bar',
    })
    @Get()
    myHandler() {}
}
```

# Cache

Use this decorator to create cache in routes, with it the request time will be more **efficient** and can be used for **static values**, or **dynamic values** with an expiration.

With it you can store it in **memory** or **Redis** database, to use Redis as a cache check the function: [**Initialize**](#cacheinitialize).

> **Note** The paths for creating values in Redis are based on the route URL.
> 
> If a null value is returned, it will be ignored.

**Parameters:**

```typescript
{
    /**
     * Define which storage should use
     * 
     * @default memory
     */
    cacheIn: 'memory' | 'redis';

    /**
     * Set how long this value will expire and become obsolete
     */
    ttl?: number;
}
```

**Example:**

```typescript
class MyController {
    @Cache({
        cacheIn: 'memory',
        ttl: 120 // 2 minutes
    })
    @Get('/user/:id')
    myHandler() {}
}
```

## Cache.delete

Use this function for a given route that deletes/updates values, this will automatically remove the data saved in cache, if I have a route that saves it to reuse it, thus updating it every time it is changed.

> **Note** It doesn't necessarily have to be a delete/update route, use as you think the data should be updated as it changes.

**Example:**

```typescript
class MyController {
    @Cache.Delete('memory') // 'memory' | 'redis'
    @Put('user/:id')
    myHandler() {}
}
```

## Cache.initialize

With this function you can initiate a connection with Redis, or just define the already connected Redis body.

> **Note** HE IS NOT A DECORATOR. Use this function before the server comes online.

**Example:**

```typescript
Cache.initialize('redis://user:root@localhost:6379');

// Or

Cache.initialize({
    username: 'user',
    password: 'root',
    host: 'localhost',
    port: 6379,
});

// Or

const redis = new Redis('redis://user:root@localhost:6379');

Cache.initialize(redis);
```

# Methods

Use these decorators to create a new path for your route, thus assuming a [**Controller**](#controllers) role.

The existing methods are: **Delete**, **Get**, **Patch**, **Post** and **Put**.

**Parameters:**

> **Note** All method decorators have the same parameter values.

```typescript
{
    /**
     * Use to set the request response status
     *
     * @default 200 = OK
     */
    status?: number | keyof typeof Status;

    /**
     * Use to define a request response validation scheme using zod
     */
    replySchema?: {
        /**
         * Scheme to validate the response
         */
        schema: any;

        /**
         * If you want it to not remove extraneous keys from the object, set it to false
         *
         * @default false
         */
        omitUnknownKeys?: boolean;
    };

    /**
     * Use to set route validations
     */
    validations?: Validation[];
}
```

**Example:**

```typescript
class MyController {
    @Get('/user/:id', {
        validations: [IsValidId],
    })
    myHandler() {}
}
```

# Params

The decorators **Reply**, **Body**, **Headers**, **Params**, **Query** and **Request** are responsible for bringing values from the request body, below you will find a description of each decorator.

- **Reply**: Gets the request response body.
- **Body**: Obtains the data sent in this request.
- **Headers**: Gets the request header.
- **Params**: Gets the parameters provided in the route URL.
- **Query**: Gets the values of a query provided in the URL.
- **Request**: Gets the body of the request

**Parameters:**

You can use the `key` parameter to get a specific value in the request body.

```typescript
Params(key?: string)
```

**Example:**

```typescript
class MyController {
    @Get('user/:id')
    myHandler(@Params('id') userId: string) {
        return userId;
    }
}
```

# Extra

## Controllers

## Validations

## Criar decorators para métodos

## Criar decorators para parâmetros