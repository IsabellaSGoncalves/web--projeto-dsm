const express = require("express");
const app = express();
const handlebars = require("express-handlebars").engine;
const bodyParser = require("body-parser");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./projetoweb2dsm-d8d09-firebase-adminsdk-w3b4l-4aa77eb7a9.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/cadastrar", function (req, res) {
  var result = db
    .collection("clientes")
    .add({
      nome: req.body.nome,
      telefone: req.body.telefone,
      origem: req.body.origem,
      data_contato: req.body.data_contato,
      observacao: req.body.observacao,
    })
    .then(function () {
      console.log("Dados cadastrados com sucesso!");
    });
});

app.get("/", function (req, res) {
  res.render("primeira_pagina");
});

app.get("/confirmar", function (req, res) {
  res.render("quarta_pagina", { posts });
  console.log(posts);
});

app.get("/consultar", function (req, res) {
  var posts = [];
  db.collection("clientes")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        posts.push(data);
      });
      res.render("segunda_pagina", { posts: posts });
    });
});

app.post("/atualizar", function (req, res) {
  const id = req.body.id;
  console.log("ID recebido:", id);
  db.collection("clientes")
    .doc(id)
    .update({
      nome: req.body.nome,
      telefone: req.body.telefone,
      origem: req.body.origem,
      data_contato: req.body.data_contato,
      observacao: req.body.observacao,
    })
    .then(() => {
      console.log("Dados atualizados com sucesso!");
      res.redirect("/consultar");
    });
});

app.get("/excluir/:id", function (req, res) {
  const id = req.params.id;
  console.log("ID recebido:", id);
  db.collection("clientes")
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        data.id = doc.id;
        res.render("quarta_pagina", { posts: [data] });
      }
    });
});

app.post("/excluir", function (req, res) {
  const id = req.body.id;
  db.collection("clientes")
    .doc(id)
    .delete()
    .then(() => {
      console.log("Dados excluídos com sucesso!");
      res.redirect("/consultar");
    });
});

app.get("/editar/:id", function (req, res) {
  const id = req.params.id;
  console.log("ID recebido:", id);
  db.collection("clientes")
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        data.id = doc.id;
        res.render("terceira_pagina", { posts: [data] });
      }
    });
});

app.listen(8081, function () {
  console.log("Servidor funfando");
});
