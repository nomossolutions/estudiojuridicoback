import mongoose, {Schema} from "mongoose";

const clienteSchema = new Schema({
  nombre: {
    type: String,        
    required: true,
    minLength: 10,
    maxLength: 30,
  },
  identificador: {
    type: String,
    required: true,
  
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    validate:{
        validator: (valor) => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(valor)
    },
  },
 telefono: {
  type: String,
  required: true,

},
estadoCliente:{
    type:String,
    required:true,
    enum: ["Activo", "Inactivo"]
},
});

const Cliente = mongoose.model("cliente", clienteSchema);

export default Cliente; 
