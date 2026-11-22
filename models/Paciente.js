import conexao from "../config/conexao.js";

const PacienteSchema = new conexao.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true },
  telefone: { type: String, required: true },
  dataNascimento: Date,
  convenio: { type: String, required: true },
});

const Paciente = conexao.model("Paciente", PacienteSchema);
export default Paciente;
