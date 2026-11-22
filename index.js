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

// ===== ROTAS DE MEDICO =====
app.get("/medico/lst", async (req, res) => {
  const pesquisa = req.query.pesquisa || "";
  let filtro = {};

  if (pesquisa) {
    filtro = {
      $or: [
        { nome: { $regex: pesquisa, $options: "i" } },
        { clinicaParceira: { $regex: pesquisa, $options: "i" } },
      ],
    };
  }

  const medicos = await Medico.find(filtro);
  res.render("medico/lst", { medicos, pesquisa });
});

app.get("/medico/add", (req, res) => {
  res.render("medico/add");
});

app.post("/medico/add", async (req, res) => {
  const { nome, crm, especialidade, clinicaParceira, ativo } = req.body;
  await Medico.create({
    nome,
    crm,
    especialidade,
    clinicaParceira,
    ativo: ativo === "true",
  });
  res.redirect("/medico/lst");
});

app.get("/medico/ver/:id", async (req, res) => {
  const medico = await Medico.findById(req.params.id);
  res.render("medico/ver", { medico });
});

app.get("/medico/edt/:id", async (req, res) => {
  const medico = await Medico.findById(req.params.id);
  res.render("medico/edt", { medico });
});

app.post("/medico/edt/:id", async (req, res) => {
  const { nome, crm, especialidade, clinicaParceira, ativo } = req.body;
  await Medico.findByIdAndUpdate(req.params.id, {
    nome,
    crm,
    especialidade,
    clinicaParceira,
    ativo: ativo === "true",
  });
  res.redirect("/medico/lst");
});

app.post("/medico/del/:id", async (req, res) => {
  await Medico.findByIdAndDelete(req.params.id);
  res.redirect("/medico/lst");
});

// ===== ROTAS DE AGENDAMENTO =====
app.get("/agendamento/lst", async (req, res) => {
  const pesquisa = req.query.pesquisa || "";
  const status = req.query.status || "";
  let filtro = {};

  if (pesquisa) {
    filtro.$or = [
      { nomePaciente: { $regex: pesquisa, $options: "i" } },
      { nomeMedico: { $regex: pesquisa, $options: "i" } },
    ];
  }

  if (status) {
    filtro.status = status;
  }

  const agendamentos = await Agendamento.find(filtro).sort({ dataHora: 1 });
  res.render("agendamento/lst", { agendamentos, pesquisa, status });
});

app.get("/agendamento/add", (req, res) => {
  res.render("agendamento/add");
});

app.post("/agendamento/add", async (req, res) => {
  const { nomePaciente, nomeMedico, tipoProcedimento, dataHora, status } =
    req.body;
  await Agendamento.create({
    nomePaciente,
    nomeMedico,
    tipoProcedimento,
    dataHora: new Date(dataHora + "-03:00"),
    status,
  });
  res.redirect("/agendamento/lst");
});

app.get("/agendamento/ver/:id", async (req, res) => {
  const agendamento = await Agendamento.findById(req.params.id);
  res.render("agendamento/ver", { agendamento });
});

app.get("/agendamento/edt/:id", async (req, res) => {
  const agendamento = await Agendamento.findById(req.params.id);
  const dataLocal = new Date(
    agendamento.dataHora.getTime() - 3 * 60 * 60 * 1000,
  );
  const dataHoraInput = dataLocal.toISOString().slice(0, 16);
  res.render("agendamento/edt", { agendamento, dataHoraInput });
});

app.post("/agendamento/edt/:id", async (req, res) => {
  const { nomePaciente, nomeMedico, tipoProcedimento, dataHora, status } =
    req.body;
  await Agendamento.findByIdAndUpdate(req.params.id, {
    nomePaciente,
    nomeMedico,
    tipoProcedimento,
    dataHora: new Date(dataHora + "-03:00"),
    status,
  });
  res.redirect("/agendamento/lst");
});

app.post("/agendamento/del/:id", async (req, res) => {
  await Agendamento.findByIdAndDelete(req.params.id);
  res.redirect("/agendamento/lst");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
