const users = require("./users.json");

// Import do express
const express = require("express");

// Cria o server executando o express
const server = express();
// Diz que será utilizado o tipo de dados JSON
server.use(express.json());

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();
  console.timeEnd("Request");
});

const checkUsersInArray = (req, res, next) => {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: `Index doesn't exists` });
  }
  req.user = user;
  return next();
};

const checkUsersExist = (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({ error: `User name is invalid` });
  }
  return next();
};

// rota get para o server, ou seja, quando acessar o recurso users, o que deve ser retornado pelo servidor
server.get("/users/", (req, res) => {
  return res.json(users);
});

// Utilizar parametro para retornar recurso específico
server.get("/users/:id", checkUsersInArray, (req, res) => {
  return res.json(req.user);
});

// Adicionar novo usuário
server.post("/users/", checkUsersExist, (req, res) => {
  const { name, age } = req.body;
  users.push({ name: name, age: age });
  return res.status(201).json(users);
});

// Editar usuário

server.put("/users/:index", checkUsersInArray, checkUsersExist, (req, res) => {
  const { index } = req.params;
  const { name, age } = req.body;
  users[index] = { name: name, age: age };

  return res.json(users);
});

// Deletar usuário
server.delete("/users/:id", checkUsersInArray, (req, res) => {
  const { name } = users.splice(req.params.id, 1);
  return res.json({ message: `User ${name} sucessful` });
});

server.listen(3001);
