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

An available option is called [**validations**](#validations), which allows you to set validations for the route endpoint. This makes it possible to carry out checks even before the data reaches the final function to be processed.

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

**Controladores** são funções ou estruturas encarregadas de gerenciar um endpoint da rota. Eles proporcionam uma maneira mais legível e fácil de manipular as rotas, seja criando novos endpoints ou atualizando os existentes.

Para criar controladores em suas rotas, basta utilizar os decoradores [**Methods**](#methods) antes de qualquer outro decorador. Se outros decoradores forem definidos antes dele, não funcionarão, pois é necessário ter a assinatura de controlador.

**Exemplo:**

```typescript
// Maneira correta
class MyController {
    @Cache({
        cacheIn: 'memory'
    })
    @Get()
    myHandler() {
        return { message: 'Hello!' }
    }
}

// Maneira errada
class MyController {
    @Get()
    @Cache({
        cacheIn: 'memory'
    })
    myHandler() {
        return { message: 'Hello!' }
    }
}
```

No último exemplo, observe que o decorador `Cache` está abaixo de `Get`. Nessa disposição, ele não funcionará, pois, como mencionado anteriormente, os decoradores que não são [**Methods**](#methods) requerem uma assinatura de controlador, a qual somente os [**Methods**](#methods) possuem e criam.

## Validations

Com as funções de validação, é possível realizar várias verificações nos dados recebidos de uma requisição, tornando a manipulação dos dados retornados segura e simples.

As validações podem ser aplicadas aos [**Methods**](#methods), garantindo que o endpoint só seja acessado após verificação. Para cada novo método criado, as validações precisam ser informadas novamente. Se desejar que as validações sejam aplicadas a vários controladores, siga as instruções abaixo.

Para tornar as validações "globais" para vários controladores, é possível defini-las nas opções do decorador [**Router**](#router). Dessa forma, todos os controladores definidos nessa rota terão todas as validações especificadas no **Router**.

**Como fazer a função de validação:**

```typescript
// Estrutura de uma função de validação
type Validation = (
    request: any,
    reply: any,
    done: HookHandlerDoneFunction,
) => Promise<unknown> | unknown;

// Exemplo de função
function validation(request, reply, done) { /* ... */ }
```

**Exemplo de validação no controlador:**

```typescript
const users = {
    1: {
        name: 'Bucky',
    },
};

function UserIdIsValid(request, reply, done) {
    if (!('id' in request.params) || isNaN(Number(request.params.id)))
        return done(new Error('This ID is invalid or does not exist'));

    return done();
}

class MyController {
    @Cache({
        cacheIn: 'memory'
    })
    @Get('user/:id', {
        validations: [UserIdIsValid],
    })
    myHandler(@Params('id') userId: string) {
        return userId;
    }
}
```

**Exemplo de validação no Router:**

```typescript
@Router({
    controllers: [MyController, MyControllerTwo],
    validations: [UserIdIsValid]
})
class MyRouter {}
```

Dessa forma como exemplificado acima, os controladores `MyController` e `MyControllerTwo` terão a mesma validação de verificar o id do usuário, obtendo dos parâmetros da requisição.

## Criar decorators para parâmetros

Você também pode criar decoradores personalizados paras as rotas, assim simplificando algumas tarefas para a manipulação da requisição.

**Parâmetros:**

```typescript
createParamDecorator(path: string, key?: string);
```

- **Path:** Aqui, você deve definir qual objeto ou dado deseja obter. O caminho para os valores desejados deve ser estruturado dessa maneira, assemelhando-se a um caminho de arquivo: `request/body` ou `request`. Isso é gerenciado graças ao pacote [**Object.mn**](https://github.com/isBucky/Object.mn).

- **Key:** Use a opção **`key`** para obter um valor específico dentro desse objeto. Esta opção é opcional. Abaixo, terá dois exemplos: um decorator com o uso de `key` e outro sem, obtendo apenas o valor inteiro.


**Exemplo:**

```typescript
import { createParamDecorator } from './';

export const User = (key?: string) => createParamDecorator('request/user', key);

export const IP = createParamDecorator('request/ip');

class MyController {
    @Get()
    myHandler(@User() user: any, @IP ip: string) {
        return { user, ip };
    }
}
```
