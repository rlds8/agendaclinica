import conexao from "../config/conexao.js";

const MedicoSchema = new conexao.Schema({
  nome: { type: String, required: true },
  crm: { type: String, required: true },
  especialidade: { type: String, required: true },
  clinicaParceira: { type: String, required: true },
  ativo: { type: Boolean, required: true, default: true },
});

const Medico = conexao.model("Medico", MedicoSchema);
export default Medico;
