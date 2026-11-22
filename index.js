import express from "express";
import "./config/conexao.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("AgendaClínica rodando e conectado ao MongoDB!");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
