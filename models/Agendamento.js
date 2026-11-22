import conexao from "../config/conexao.js";

const AgendamentoSchema = new conexao.Schema({
  nomePaciente: { type: String, required: true },
  nomeMedico: { type: String, required: true },
  tipoProcedimento: { type: String, required: true },
  dataHora: { type: Date, required: true },
  status: { type: String, required: true },
});

const Agendamento = conexao.model("Agendamento", AgendamentoSchema);
export default Agendamento;
