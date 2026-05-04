import mongoose, { Schema } from "mongoose";

const clienteSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    minlength: [10, "El nombre debe tener mínimo 10 caracteres"],
    maxlength: [30, "El nombre no debe exceder 30 caracteres"],
  },
  identificador: {
    type: String,
    required: true,

  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (valor) => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(valor)
    },
  },
  telefono: {
    type: String,
    required: true,

  },
  estadoCliente: {
    type: String,
    required: true,
    enum: ["Activo", "Inactivo"]
  },
});

const Cliente = mongoose.model("cliente", clienteSchema);

export default Cliente; 
