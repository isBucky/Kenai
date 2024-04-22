<div align="center">
    <h1>Kenai</h1>
    <p>Criação e gerenciamento de rotas <strong>Fastify</strong> usando decorators.</p>
</div>

# Tabela de conteúdo

- [**Instalação**](#)
- [**Primeiros Passos**](#)
- [**LoadRoutes**](#loadroutes)
- [**Router**](#)
- [**Docs**](#)
- [**Metadata**](#)
- [**Cache**](#)
- [**Methods**](#)
    - [**Delete**](#)
    - [**Get**](#)
    - [**Patch**](#)
    - [**Post**](#)
    - [**Put**](#)
- [**Params**](#)
    - [**Reply**](#)
    - [**Request**](#)
    - [**Body**](#)
    - [**Headers**](#)
    - [**Params**](#)
    - [**Query**](#)
- [**Extra**](#)
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

**Parâmetros**:

| Nome | Obrigatório | Descrição |
| ---- | ----------- | --------- |
| app | Sim | Instancia da aplicação fastify | 
| mainRoute | Sim | Rota principal da sua aplicação | 
| controllerParameters | Não | Esta opção é utilizada para definir os parâmetros de todas as rotas | 

**Exemplo**:

```typescript
LoadRoutes({
    app: FastifyApp,
    mainRoute: MainRoute,
    controllerParameters: ['foo', 'bar']
});
```


# Router

# Docs

# Metadata

# Cache

# Methods

## Delete

## Get

## Patch

## Post

## Put

# Params

## Reply

## Request

## Body

## Headers

## Params

## Query

# Extra

## Criar decorators para métodos

## Criar decorators para parâmetros