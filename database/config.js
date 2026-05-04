import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_CNN;

if (!uri) {
  throw new Error("La variable MONGODB_CNN no está definida en el archivo .env");
}

mongoose.connect(uri)
  .then(() => {
    console.info("Conectado a MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error.message);
  });

export default mongoose;