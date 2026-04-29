import mongoose from "mongoose";

const facturacionSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const day = value.getDay();
        return day >= 1 && day <= 5;
      },
      message: (props) =>
        `El día ${props.value.toDateString()} no es válido para agendar eventos`,
    },
  },

  nombreCliente: {
    type: String,
    required: true,
    maxLength: 30,
    minLength: 10,
  },

  concepto: {
    type: String,
    required: true,
    maxLength: 50,
    minLength: 15,
  },
  
  seleccionarArchivo: {
    url: { type: String },
    public_id: { type: String},
    nombre: { type: String},
  },
  monto: {
    type: Number,
    required: true,
    min: 1,
  },
  estado: {
    type: String,
    required: true,
    enum: ["Pendiente", "Pagada", "Anulada"],
  },
});

const Facturacion = mongoose.model("facturacion", facturacionSchema);
export default Facturacion;
