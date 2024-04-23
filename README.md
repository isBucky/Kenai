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
    - [**Delete**](#delete)
    - [**Get**](#get)
    - [**Patch**](#patch)
    - [**Post**](#post)
    - [**Put**](#put)
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

> Abaixo tem uma exemplificação de como usar os decorators para criar suas rotas, a criação das rotas **é com base na rota principal** e para **toda sub-rota tem que haver uma rota principal**, assim como a rota `/users` deve pertencer a rota `/` (principal) e cada rota pode haver **controladores em pastas separadas** assim como no exemplo [**Clique aqui**](https://github.com/isBucky/Kenai/tree/main/examples/several-routes), deste modo **não poluindo seu código** criando varias funções em uma classe da rota.
> 
> > **Para saber mais sobre esses recursos leia [LoadRoutes](#loadroutes) e [Router](#router).**


## Exemplo de única rota
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

> Você deve usar essa função para carregar todas as rotas criadas pelos decorators.

## Parâmetros

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

## Exemplo

```typescript
LoadRoutes({
    app: FastifyApp,
    mainRoute: MainRoute,
    controllerParameters: ['foo', 'bar']
});
```

# Router

> Use essa rota para criar novas rotas para o Fastify

## Parâmetros

**Path:** Caminho que a rota será criada. Não é obrigatório

**Options:**

> Saiba mais sobre [**Controllers**](#controllers) e [**Validations**](#validations)

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

## Exemplo

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

> Use essa rota para definir um objeto contendo informações sobre a rota, com isso você pode criar docs personalizadas

## Parâmetros

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

## Exemplo

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

> Use esse decorator para definir valores de sua preferencia na rota

**Parâmetros:**

O valor do parâmetro pode ser qualquer coisa para ser definida

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

>

**Parâmetros:**

| Nome | Obrigatório | Descrição |
| ---- | ----------- | --------- |
|  |  |  | 

**Exemplo:**

```typescript
```


# Methods

Use esses decorators para criar um novo caminho para sua rota, os métodos existentes são: **Delete**, **Get**, **Patch**, **Post** e **Put**.

## Parâmetros

> **Todos os decorators de métodos possuem os mesmos valores de parâmetros**

```typescript
{
    /**
     * Use para definir o status da resposta da requisição
     *
     * @default 200 = OK
     */
    status?: number | keyof typeof Status;

    /**
     * Use para definir o esquema de validação da resposta da requisição
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

## Reply

>

**Parâmetros:**

| Nome | Obrigatório | Descrição |
| ---- | ----------- | --------- |
|  |  |  | 

**Exemplo:**

```typescript
```


## Request

>

**Parâmetros:**

| Nome | Obrigatório | Descrição |
| ---- | ----------- | --------- |
|  |  |  | 

**Exemplo:**

```typescript
```


## Body

>

**Parâmetros:**

| Nome | Obrigatório | Descrição |
| ---- | ----------- | --------- |
|  |  |  | 

**Exemplo:**

```typescript
```


## Headers

>

**Parâmetros:**

| Nome | Obrigatório | Descrição |
| ---- | ----------- | --------- |
|  |  |  | 

**Exemplo:**

```typescript
```


## Params

>

**Parâmetros:**

| Nome | Obrigatório | Descrição |
| ---- | ----------- | --------- |
|  |  |  | 

**Exemplo:**

```typescript
```


## Query

>

**Parâmetros:**

| Nome | Obrigatório | Descrição |
| ---- | ----------- | --------- |
|  |  |  | 

**Exemplo:**

```typescript
```


# Extra

## Controllers

## Validations

## Criar decorators para métodos

## Criar decorators para parâmetros