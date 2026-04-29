import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB;

if (!uri) {
  throw new Error("La variable MONGODB no está definida en el archivo .env");
}

mongoose.connect(uri)
  .then(() => {
    console.info("Conectado a MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error.message);
  });

export default mongoose;