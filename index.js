import express from "express";
import "./config/conexao.js";
import Paciente from "./models/Paciente.js";
import Medico from "./models/Medico.js";
import Agendamento from "./models/Agendamento.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

// ===== ROTAS DE PACIENTE =====
app.get("/paciente/lst", async (req, res) => {
  const pesquisa = req.query.pesquisa || "";
  let filtro = {};

  if (pesquisa) {
    filtro = {
      $or: [
        { nome: { $regex: pesquisa, $options: "i" } },
        { cpf: { $regex: pesquisa, $options: "i" } },
      ],
    };
  }

  const pacientes = await Paciente.find(filtro);
  res.render("paciente/lst", { pacientes, pesquisa });
});

app.get("/paciente/add", (req, res) => {
  res.render("paciente/add");
});

app.post("/paciente/add", async (req, res) => {
  const { nome, cpf, telefone, dataNascimento, convenio } = req.body;
  await Paciente.create({
    nome,
    cpf,
    telefone,
    dataNascimento: dataNascimento || null,
    convenio,
  });
  res.redirect("/paciente/lst");
});

app.get("/paciente/ver/:id", async (req, res) => {
  const paciente = await Paciente.findById(req.params.id);
  res.render("paciente/ver", { paciente });
});

app.get("/paciente/edt/:id", async (req, res) => {
  const paciente = await Paciente.findById(req.params.id);
  res.render("paciente/edt", { paciente });
});

app.post("/paciente/edt/:id", async (req, res) => {
  const { nome, cpf, telefone, dataNascimento, convenio } = req.body;
  await Paciente.findByIdAndUpdate(req.params.id, {
    nome,
    cpf,
    telefone,
    dataNascimento: dataNascimento || null,
    convenio,
  });
  res.redirect("/paciente/lst");
});

app.post("/paciente/del/:id", async (req, res) => {
  await Paciente.findByIdAndDelete(req.params.id);
  res.redirect("/paciente/lst");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
