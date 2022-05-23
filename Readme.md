# Tech4um

O tech4um será um fórum de texto, onde as conversas serão baseadas em canais que os próprios usuários criarem, somente usuários logados poderão acessar os canais para conversar e criar canais.

## 🚀 Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento.

Consulte **Instalação** para saber como implantar o projeto.

Documentação do websocekt está no final do arquivo.

### 📋 Pré-requisitos

De que coisas você precisa para instalar o software e como instalá-lo?

```
Node na versão 14.17.6+;
```

### 🔧 Instalação

Para executar o projeto, você precisa instalar o Node.js. Para isso, você pode usar o [Node.js](https://nodejs.org/en/download/) ou o [npm](https://www.npmjs.com/get-npm/).

Irá precisar instalar as dependências do projeto.

```
npm i ou yarn
```

Aṕos isso, você pode executar o projeto.

```
npm rum start ou yarn start

```

Terá o seguinte resultado:


```
> Server started on port 3333

```

## 📦 Desenvolvimento

A documentação da API REST está disponivel pelo postman no link [DOCUMENTAÇÃO](https://documenter.getpostman.com/view/17298396/Uyxkkm8b).

## 🛠️ Construído com

* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [Socket.io](https://socket.io/)

## 🖇️ Socket.io

Para se conectar ao servidor, você precisa usar o [Socket.io](https://socket.io/). É necessario instalar o pacote [socket.io-client](https://www.npmjs.com/package/socket.io-client) no frontend.

Para se conectar ao socket é preciso enviar o token de autenticação do usuário, caso contrário a conexão será encerrada, segue o exemplo da documentação.

~~~
import { io } from "socket.io-client";

const socket = io({
  auth: {
    token: "token-do-úsuario"
  }
});
~~~

### 👇🏻Os eventos disparados do socket para o front são:

### message
Evento disparado quando um usuário envia uma mensagem no canal.

~~~
{
    "message": {
        "user": {
            "name": "Ricardo",
            "email": "luis.ricardo@tech4h.com.br",
            "id": "0f6cbcae-bc95-4f06-b02d-0c6598c088dc"
        },
        "message": "mensagem no geral",
        "to": null,
        "timestamp": "2022-05-18T13:57:58.629Z"
    },
    "roomId": "a4f25db6-6ead-4553-a28b-a7dbf95fb0e8"
}
~~~

### left
Evento disparado quando um usuário sai do canal.
~~~
{
    "user": {
        "name": "Ricardo",
        "email": "luis.ricardo@tech4h.com.br",
        "id": "98f29861-48e5-49b0-82fc-6b109d2c2172"
    },
    "roomId": "a4f25db6-6ead-4553-a28b-a7dbf95fb0e8"
}
~~~

### joined
Evento disparado quando um usuário entra no canal.
~~~
{
    "user": {
        "name": "Ricardo",
        "email": "luis.ricardo@tech4h.com.br",
        "id": "98f29861-48e5-49b0-82fc-6b109d2c2172"
    },
    "roomId": "a4f25db6-6ead-4553-a28b-a7dbf95fb0e8"
}
~~~

### new-room
Evento disparado quando um usuário cria um novo canal.
~~~
{
    id: '27727752-d35c-4cd0-a3fb-5ce09b2e1b8c',
    name: 'Squad 2',
    description: 'Alinhamentos',
    by: {
        name: 'Big Ricardo',
        email: 'luis.ricardo@tech4h.com.br',
        id: '115b1561-7fe0-4ac1-b130-87a9d0467021'
    },
    numUsers: 0,
    users: []
}
~~~

### delete-room
Evento disparado quando um usuário deleta um canal.
~~~
{
       "id": "c6458b3a-ee86-408d-a0e4-b8fcde31b671"
}
~~~

### ☝🏻Eventos disparados para o backend são:

### join
Evento deve ser disparado quando um usuário entrar no canal. Deve ser passado o id do canal.

~~~
    socket.emit("join", roomId);
~~~

### leave
Evento deve ser disparado quando um usuário sair do canal. Deve ser passado o id do canal.

~~~
    socket.emit("leave", roomId);
~~~

---
⌨️ com ❤️ por [L Ricardo](mailto:luis.ricardo@tech4h.com.br) 😊
