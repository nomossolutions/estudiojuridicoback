import mongoose, { Schema } from "mongoose";

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    minlength: [4, "El nombre debe tener al menos 4 caracteres"],
    maxlength: [30, "El nombre no debe exceder los 30 caracteres"],
  },
  apellido: {
    type: String,
    required: [true, "El apellido es obligatorio"],
    minlength: [4, "El apellido debe tener al menos 4 caracteres"],
    maxlength: [30, "El apellido no debe exceder los 30 caracteres"],
  },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
    match: [
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
      "El correo no es válido",
    ],
  },
  telefono: {
    type: String,
    required: [true, "El teléfono es obligatorio"],
    match: [/^\d+$/, "El número de teléfono no es válido"],
  },
  formBasicPassword: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: [true, "El rol es obligatorio"],
    enum: ["admin", "secre", "abog"],
  },
});

const Usuario = mongoose.model("usuario", usuarioSchema);
export default Usuario;