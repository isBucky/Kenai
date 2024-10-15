<div align="center">
    <h1>Kenai</h1>
    <p>Cria o e gerencie rotas do <strong>Fastify</strong> utilizando decorators.</p>
    <p>
        <a href="https://www.npmjs.com/package/kenai"><img src="https://img.shields.io/npm/v/kenai?style=flat-square&maxAge=3600" alt="NPM version" /></a>
        <a href="https://www.npmjs.com/package/kenai"><img src="https://img.shields.io/npm/dt/kenai?style=flat-square&maxAge=3600" alt="NPM downloads" /></a>
        <a href="https://www.npmjs.com/package/kenai"><img src="https://img.shields.io/github/languages/code-size/isBucky/Kenai?style=flat-square&maxAge=3600" alt="NPM size" /></a>
        <a href="https://www.npmjs.com/package/kenai"><img src="https://img.shields.io/npm/l/kenai?style=flat-square&maxAge=3600" alt="NPM license" /></a>
  </p>
</div>

# Idiomas

-   [Inglês](README.md)

# Sumário

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

# Instalação

```powershell
npm install kenai
```

# Primeiros passos

Antes de começar a usar os decorators, precisamos configurar o **Kenai** como um plugin do **Fastify**. Abaixo estão as opções de configuração do plugin:

| Opção                  | Descrição                                                                | Obrigatório |
| ---------------------- | ------------------------------------------------------------------------ | ----------- |
| `mainRouter`           | Define a rota principal do Fastify                                       | Sim         |
| `zodCustomParser`      | Define um parser customizado para os erros do Zod                        | Não         |
| `redis`                | Define as configurações do Redis para rotas com cache                    | Não         |
| `controllerParameters` | Define os parâmetros para a classe do controlador, como o servidor em si | Não         |

**Exemplo de como configurar o plugin:**

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

Este decorator é responsável por criar rotas no Fastify, permitindo definir middlewares, novas rotas e controladores em uma única chamada.

As rotas externas definidas dentro do corpo do decorator são automaticamente integradas, associando suas URLs às rotas 'filhas' de forma dinâmica e isso também se aplica nos middlewares.

**Opções de configuração:**

| Opção         | Descrição                                                       | Obrigatório |
| ------------- | --------------------------------------------------------------- | ----------- |
| `routers`     | Use para definir novas rotas a partir desse endpoint            | Sim         |
| `middlewares` | Responsável por adicionar middlewares nas rotas para validações | Não         |
| `controllers` | Responsável por adicionar controladores nas rotas               | Sim         |

**Seguem abaixo um exemplo de como criar uma rota:**

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

**Criando rotas e controladores externos:**

> Os controladores são definidos a partir dos decorators [**Methods**](#methods)

```typescript
import { Router, Get } from 'kenai';

class HelloWorldController {
    @Get()
    helloWorld() {
        return 'Hello World!';
    }
}

// Rota externa porem interligadas, url final: /v1/hello-world
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

Os middlewares são responsáveis por validar as requisições, **sendo invocados antes do processamento principal** e posteriormente executados.

**Exemplo de como criar um middleware:**

> Você pode adicionar **mais de um** middleware, basta adicionar uma virgula entre os middlewares.

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

Esse decorator é responsável por validar todos os dados enviados para o corpo da requisição, utilizando o [Zod](https://github.com/colinhacks/zod) como um schema de validação.

| Opção             | Descrição                                                           | Obrigatório |
| ----------------- | ------------------------------------------------------------------- | ----------- |
| `schema`          | Define o schema de validação utilizando o zod                       | Sim         |
| `omitUnknownKeys` | Define se o validador deve remover chaves que não existem no schema | Não         |

**Exemplo de como usar o BodySchema:**

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

Esse decorator é responsável por validar todos os dados enviados na URL da requisição, utilizando o [Zod](https://github.com/colinhacks/zod) como um schema de validação.

> O schema criado no zod, deve ter todas as propriedades como opcionais, caso contrario ele criara erros para valores que não foram informados.

| Opção             | Descrição                                                           | Obrigatório |
| ----------------- | ------------------------------------------------------------------- | ----------- |
| `schema`          | Define o schema de validação utilizando o zod                       | Sim         |
| `omitUnknownKeys` | Define se o validador deve remover chaves que não existem no schema | Não         |

**Exemplo de como usar o QuerySchema:**

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

Esse decorator é responsável por validar todos os parâmetros passados na Url da requisição, utilizando o [Zod](https://github.com/colinhacks/zod) como um schema de validação.

| Opção    | Descrição                                     | Obrigatório |
| -------- | --------------------------------------------- | ----------- |
| `schema` | Define o schema de validação utilizando o zod | Sim         |

**Exemplo de como usar o ParamsSchema:**

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

Esse decorator define todas os possíveis retornos da requisição, definindo o status e o corpo da resposta utilizando o [Zod](https://github.com/colinhacks/zod) como validação para a saída.

| Opção    | Descrição                                     | Obrigatório |
| -------- | --------------------------------------------- | ----------- |
| `status` | Define o status da resposta                   | Sim         |
| `schema` | Define o schema de validação utilizando o zod | Sim         |

**Exemplo de como usar o Returns:**

```typescript
import { Returns, Get } from 'kenai';
import { z } from 'zod';

class MainRouter {
    @Returns(200, z.object({ name: z.string().min(1) }))
    @Get()
    run() {
        return { name: 'Kenai' };
    }
}
```

## Methods

Os métodos são os responsáveis por criar os controladores da rota.

**Todos os métodos aceitam esses mesmos parâmetros:**

| Opção                | Descrição                                                                                                         | Obrigatório |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------- |
| `path`               | Define o caminho da rota                                                                                          | Sim         |
| `fastifyRoteOptions` | Defina as [configurações do Fastify para rotas](https://fastify.dev/docs/latest/Reference/Routes/#routes-options) | Não         |

### Get

Esse decorator é responsável por criar um controlador para uma rota [GET](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/GET).

**Exemplo de como usar o Get:**

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

Esse decorator é responsável por criar um controlador para uma rota [POST](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/POST).

**Exemplo de como usar o Post:**

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

Esse decorator é responsável por criar um controlador para uma rota [PUT](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/PUT).

**Exemplo de como usar o Put:**

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

Esse decorator é responsável por criar um controlador para uma rota [PATCH](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/PATCH).

**Exemplo de como usar o Patch:**

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

Esse decorator é responsável por criar um controlador para uma rota [DELETE](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/DELETE).

**Exemplo de como usar o Delete:**

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

Os 'params' são responsáveis por criar parâmetros customizados no handler da rota.

**Todos os 'params' aceitam esses mesmos parâmetros:**

| Opção | Descrição                                               | Obrigatório |
| ----- | ------------------------------------------------------- | ----------- |
| `key` | Nome de algum valor que possa ser obtido naquele objeto | Sim         |

### Reply

Esse decorator faz retornar todo os corpo da resposta da requisição.

**Exemplo de como usar o Reply:**

```typescript
import { Reply, Post } from 'kenai';

class MainRouter {
    @Post('/hello-world')
    helloWorld(@Reply() reply: FastifyReply) {
        return reply.code(401).send('Unauthorized');
    }
}

// Obtendo valores dentro do corpo da requisição

class MainRouter {
    @Post('/hello-world')
    helloWorld(@Reply('statusCode') statusCode: number) {
        return statusCode;
    }
}
```

### Request

Esse decorator faz retornar todo o request da requisição.

**Exemplo de como usar o Request:**

```typescript
import { Request, Post } from 'kenai';

class MainRouter {
    @Post('/hello-world')
    helloWorld(@Request() request: FastifyRequest) {
        return request;
    }
}

// Obtendo valores dentro do corpo da requisição

class MainRouter {
    @Post('/hello-world')
    helloWorld(@Request('body') body: any) {
        return body;
    }
}
```

### Params

Esse decorator faz retornar todos os parâmetros da requisição.

**Exemplo de como usar o Params:**

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

Esse decorator faz retornar todo o corpo da requisição.

**Exemplo de como usar o Body:**

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

Esse decorator faz retornar todos os query parameters da requisição.

**Exemplo de como usar o Query:**

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

Esse decorator faz retornar todos os headers da requisição.

**Exemplo de como usar o Headers:**

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

Esse decorator permite armazenar o resultado de uma rota em cache. Isso significa que, quando uma solicitação for feita para essa rota, os resultados são armazenados no cache e reutilizado na proxima solicitação, assim economizando tempo de resposta.

> Para o sistema de cache funcionar, deve-se estabelecer uma conexão com o redis nas opções de configuração do Kenai (Plugin).

| Opção  | Descrição                                                  | Obrigatório |
| ------ | ---------------------------------------------------------- | ----------- |
| `time` | Tempo em segundos que o resultado será armazenado no cache | Sim         |

**Exemplo de como usar o Cache:**

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

Este decorator permite invalidar o cache de uma rota sempre que o conteúdo armazenado for atualizado. Isso significa que, ao chamar a rota, o cache correspondente será automaticamente invalidado, garantindo que a próxima solicitação retorne dados atualizados.

Por exemplo, eu tenho uma rota que puxa todos os usuários do banco de dados e outro que atualiza um usuário especifico. Quando eu atualizo um usuário, eu quero que o cache seja invalidado para que eu possa ter os dados atualizados na proxima solicitação.

**Exemplo de como usar o Cache.InvalidateOnUpdate:**

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

Os decorators dessa categoria têm a função de descrever as rotas, gerando automaticamente a documentação com o [Swagger](https://www.npmjs.com/package/@fastify/swagger-ui) a partir dessas descrições.

Decorators como [BodySchema](#bodyschema), [ParamsSchema](#paramsschema), [QuerySchema](#queryschema) e [Returns](#returns) aceitam o [Zod](https://github.com/colinhacks/zod) como schema de validação. Isso permite que você defina descrições detalhadas para os valores utilizando a função `describe`, ou crie especificações completas com o pacote [zod-to-openapi](https://github.com/samchungy/zod-openapi).

### Description

Esse decorator defini uma descrição sobre a rota.

| Opção         | Descrição       | Obrigatório |
| ------------- | --------------- | ----------- |
| `description` | Descreve a rota | Sim         |

**Exemplo de como usar o Description:**

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

Esse decorator defini um resumo sobre a rota.

| Opção     | Descrição      | Obrigatório |
| --------- | -------------- | ----------- |
| `summary` | Resumo da rota | Sim         |

**Exemplo de como usar o Summary:**

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

Esse decorator defini tags para a rota. As tags são muito úteis para organizar as rotas em categorias lógicas, tornando a documentação da API mais fácil de entender e navegar.

| Opção  | Descrição    | Obrigatório |
| ------ | ------------ | ----------- |
| `tags` | Tags da rota | Sim         |

**Exemplo de como usar o Tags:**

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

Esse decorator define quais tipos de conteúdo podem ser enviados na requisição. Ele é útil para especificar se a rota aceita apenas `application/json`, por exemplo.

| Opção      | Descrição                 | Obrigatório |
| ---------- | ------------------------- | ----------- |
| `consumes` | Tipos de conteúdo aceitos | Sim         |

**Exemplo de como usar o Consumes:**

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

Esse decorator define quais seguranças devem ser usadas para proteger a rota. Ele é útil para especificar se a rota precisa de autenticação, por exemplo.

| Opção      | Descrição          | Obrigatório |
| ---------- | ------------------ | ----------- |
| `security` | Seguranças da rota | Sim         |

**Exemplo de como usar o Security:**

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

Esse decorator define o nome de uma operação. Ele é útil para definir nomes diferentes para as operações em um mesmo controlador.

| Opção         | Descrição        | Obrigatório |
| ------------- | ---------------- | ----------- |
| `operationId` | Nome da operação | Sim         |

**Exemplo de como usar o OperationId:**

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

Esse decorator define se a rota é deprecated. Ele é útil para marcar rotas que não devem ser usadas em produção.

**Exemplo de como usar o Deprecated:**

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

Esse decorator define se a rota deve ser ocultada. Ele é útil para marcar rotas que não devem ser exibidas na documentação da API.

**Exemplo de como usar o Hide:**

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

Use essa função para criar decorators para os parâmetros da rota. Por exemplo:

| Opção  | Descrição                                    | Obrigatório |
| ------ | -------------------------------------------- | ----------- |
| `path` | Caminho inicial onde será obtido o parâmetro | Sim         |
| `key`  | Nome da propriedade que deseja obter         | Não         |

```typescript
import { createParamsDecorator, Get } from 'kenai';

const Session = (key?: string) => createParamsDecorator('request/session', key);
// Ou
const IP = createParamsDecorator('request/ip');

export class MainRouter {
    @Get('/')
    run(@Session() session: any, @IP ip: string) {
        return { session, ip };
    }
}
```
