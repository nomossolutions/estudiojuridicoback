import mongoose, { Schema } from "mongoose";


const juicioSchema = new Schema({

    nombreCliente: {
        type: String,
        required: [true, "El nombre del cliente es obligatorio"],
        minlength: [4, "El nombre del cliente debe tener al menos 4 caracteres"],
        maxlength: [30, "El nombre del cliente no debe exceder los 30 caracteres"],
    },

    nombreDeJuicio: {
        type: String,
        required: [true, "El nombre del caso es obligatorio"],
        minlength: [4, "El nombre del caso debe tener al menos 4 caracteres"],
        maxlength: [100, "El nombre del caso no debe exceder los 100 caracteres"],
    },

    numeroExpediente: {
        type: String,
        required: [true, "El Número de expediente es obligatorio"],
    },

    juzgado: {
        type: String,
        required: [true, "El nombre del Juzgado es obligatorio"],
        minlength: [4, "El nombre del caso debe tener al menos 4 caracteres"],
        maxlength: [50, "El nombre del caso no debe exceder los 50 caracteres"],
    },

    fecha: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                const day = value.getDay();
                return day >= 1 && day <= 5;
            },
            message: props => `El día ${props.value.toDateString()} no es válido para agendar eventos`
        }
    },

  seleccionarArchivo: {
    url: { type: String },
    public_id: { type: String},
    nombre: { type: String},
  },
});

const Juicio = mongoose.model("juicio", juicioSchema);
export default Juicio;