<div align="center">
    <h1>Kenai</h1>
    <p>Criação e gerenciamento de rotas <strong>Fastify</strong> usando decorators.</p>
</div>

# Tabela de conteúdo

- [**Instalação**](#)
- [**Primeiros Passos**](#)
- [**LoadRoutes**](#loadroutes)
- [**Router**](#router)
- [**Docs**](#docs)
- [**Metadata**](#metadata)
- [**Cache**](#cache)
- [**Methods**](#methods)
- [**Params**](#params)
    - [**Reply**](#reply)
    - [**Request**](#request)
    - [**Body**](#body)
    - [**Headers**](#headers)
    - [**Params**](#params)
    - [**Query**](#query)
- [**Extra**](#extra)
    - [**Criar Decorators Para Métodos**](#)
    - [**Criar Decorators Para Parâmetros**](#)


# Instalação

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

# Primeiros Passos

Abaixo tem uma exemplificação de como usar os decorators para criar suas rotas, a criação das rotas **é com base na rota principal** e para **toda sub-rota tem que haver uma rota principal**, assim como a rota `/users` deve pertencer a rota `/` (principal) e cada rota pode haver **controladores em pastas separadas** assim como no exemplo [**Clique aqui**](https://github.com/isBucky/Kenai/tree/main/examples/several-routes), deste modo **não poluindo seu código** criando varias funções em uma classe da rota.

> **Note** Para saber mais sobre esses recursos leia [LoadRoutes](#loadroutes) e [Router](#router).


**Exemplo de única rota:**
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

Você deve usar essa função para carregar todas as rotas criadas pelos decorators.

**Parâmetros:**

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

**Exemplo:**

```typescript
LoadRoutes({
    app: FastifyApp,
    mainRoute: MainRoute,
    controllerParameters: ['foo', 'bar']
});
```

# Router

Use esse decorator para criar novas rotas no servidor Fastify.

**Parâmetros:**

**Path:** Caminho que a rota será criada. Não é obrigatório.

**Options:**

> **Note** Saiba mais sobre [Controllers](#controllers) e [Validations](#validations).

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

**Exemplo:**

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

Use essa rota para definir um objeto contendo informações sobre a rota, com isso você pode criar docs personalizadas.

**Parâmetros:**

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

**Exemplo:**

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

Use esse decorator para definir valores de sua preferencia na rota.

**Parâmetros:**

O valor do parâmetro pode ser qualquer coisa para ser definida.

**Exemplo:**

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

Use esse decorator para criar cache em rotas, com ela o tempo de requisições será mais **eficiente** e pode ser usada para **valores estáticos**, ou **valores dinâmicos** com uma expiração.

Com ele você pode armazenar em **memória** ou banco de dados **Redis**, para usar o Redis como cache verifique a função: [**Initialize**](#cacheinitialize).

> **Note** Os caminhos de criação dos valores no Redis, são com base na URL da rota.
> 
> Em caso de valor nulo ser retornado, será ignorado.

**Parâmetros:**

```typescript
{
    /**
     * Defina qual armazenamento deve usar
     * 
     * @default memory
     */
    cacheIn: 'memory' | 'redis';

    /**
     * Defina quanto tempo esse valor vai expirar e torna-se obsoleto
     */
    ttl?: number;
}
```

**Exemplo:**

```typescript
class MyController {
    @Cache({
        cacheIn: 'memory',
        ttl: 120 // 2 minutos
    })
    @Get('/user/:id')
    myHandler() {}
}
```

## Cache.delete

Use essa função para uma determinada rota que deleta/atualiza valores, com isso removerá automaticamente os dados salvos em cache, caso tenho alguma rota que salve-os para reutiliza-los, assim atualizando-os toda vez que são mudados.

> **Note** Não necessariamente precisar ser uma rota que deleta/atualiza, use conforme você acha que os dados devem ser atualizados conforme mudam.

**Exemplo:**

```typescript
class MyController {
    @Cache.Delete('memory') // 'memory' | 'redis'
    @Put('user/:id')
    myHandler() {}
}
```

## Cache.initialize

Com essa função você pode iniciar uma conexão com o Redis, ou apenas definir o corpo do Redis ja conectado.

> **Note** ELE NÃO É UM DECORATOR. Use essa função antes do servidor ficar online.

**Exemplo:**

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

Use esses decorators para criar um novo caminho para sua rota, assim assumindo um papel de [**Controller**](#controllers).

Os métodos existentes são: **Delete**, **Get**, **Patch**, **Post** e **Put**.

**Parâmetros:**

> **Note** Todos os decorators de métodos possuem os mesmos valores de parâmetros.

```typescript
{
    /**
     * Use para definir o status de resposta da requisição
     *
     * @default 200 = OK
     */
    status?: number | keyof typeof Status;

    /**
     * Use para definir um esquema de validação da resposta da requisição usando zod
     */
    replySchema?: {
        /**
         * Esquema para validar a resposta
         */
        schema: any;

        /**
         * Se você deseja que ele não remova as chaves estranhas do objeto, define como false
         *
         * @default false
         */
        omitUnknownKeys?: boolean;
    };

    /**
     * Use para definir as validações da rota
     */
    validations?: Validation[];
}
```

**Exemplo:**

```typescript
class MyController {
    @Get('/user/:id', {
        validations: [IsValidId],
    })
    myHandler() {}
}
```

# Params

Os decorators **Reply**, **Body**, **Headers**, **Params**, **Query** e **Request** são responsáveis por trazer valores do corpo da requisição, abaixo terá uma descrição de cada decorator.

**Reply**: Obtém o corpo de resposta da requisição.

**Body**: Obtêm o dados enviados nessa requisição.

**Headers**: Obtém o cabeçalho da requisição.

**Params**: Obtém os parâmetros fornecidos na URL da rota.

**Query**: Obtém os valores de uma query informada na URL.

**Request**: Obtém o corpo da requisição

**Parâmetros:**

Você pode usar o parâmetro `key` para obter um valor especifico no corpo da requisição.

```typescript
Params(key?: string)
```

**Exemplo:**

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