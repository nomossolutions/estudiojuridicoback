import mongoose, { Schema } from "mongoose";

const citaSchema = new Schema({
  fecha: {
    type: Date,
    required: true,
  },
  hora: {
    type: String,
    required: true,
    //match es la validacion de formato de hora HH:MM 24 horas o enum que es enumeracion fija
    enum: [
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
    ],
  },
  cliente: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 30,
  },
  abogado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuario",
    required: true,
    validate: {
      validator: async function (value) {
        const existe = await mongoose.model("usuario").exists({ _id: value });
        return existe;
      },
    },
  },
  tipoEvento: {
    type: String,
    required: true,
    enum: ["Consulta", "Audiencia", "Reunion"],
  },
  notas: {
    type: String,
    minLength: 10,
    maxLength: 300,
    required: true,
    trim: true,
  },
});

const Cita = mongoose.model("cita", citaSchema);

export default Cita;
