import mongoose from "mongoose";

const url =
  "mongodb+srv://robshowinterlopes_db_user:zFueArs5rXgdQM3G@cluster0.gj3qmau.mongodb.net/agendaclinica";
const conexao = await mongoose.connect(url);

export default conexao;
