import mongoose, { Schema } from "mongoose";

const tareaSchema = new Schema({
  descripcion: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 1000,
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
  fecha: {
    type: Date,
    required: true,
  },
  prioridad:{
    type: String,
    required: true,
    enum: ["alta", "media", "baja"],
  },
  estado:{
    type:String,
    required:true,
    enum:["Pendiente", "Proceso", "Completada", "Cancelada", "Reprogramada"],
  }
});


const Tarea = mongoose.model("tarea", tareaSchema);

export default Tarea;