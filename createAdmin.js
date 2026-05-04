import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Usuario from "./models/usuario.js";

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
const uri = process.env.MONGODB_CNN;

if (!uri) {
  console.error("Error: La variable MONGODB_CNN no está definida en el archivo .env");
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Conectado a MongoDB");

    // Datos del usuario admin
    const adminData = {
      nombre: "Administrador",
      apellido: "Admin",
      email: "admin@example.com",
      telefono: "123456789",
      password: "Admin123$", // Contraseña en texto plano, se encriptará por el modelo
      role: "admin",
    };

    // Crear el usuario
    const nuevoAdmin = new Usuario(adminData);
    await nuevoAdmin.save();

    console.log("Usuario administrador creado exitosamente:");
    console.log(`- Email: ${adminData.email}`);
    console.log(`- Contraseña: ${adminData.password}`);
    console.log(`- Rol: ${adminData.role}`);

  } catch (error) {
    console.error("Error al crear el usuario administrador:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("Conexión cerrada");
    process.exit(0);
  }
};

run();