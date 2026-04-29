import SubirArchivo from "../models/subirArchivo.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

//POST
export const crearSubirArchivo = async (req, res) => {
  try {
     if (!req.file) {
      return res.status(400).json({ mensaje: "Debe subir un archivo" });
    }
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: "archivos_pdf",
      pages: true,
    });

    fs.unlinkSync(req.file.path);

    const archivoNuevo = new SubirArchivo({
      nombreCliente: req.body.nombreCliente,
      tipodearchivo: req.body.tipodearchivo,
      fecha: req.body.fecha,
      seleccionarArchivo: {
        url: resultado.secure_url,
        public_id: resultado.public_id,
        nombre: req.file.originalname,
      },
    });
    await archivoNuevo.save();
    const archivoFormateado = {
      ...archivoNuevo.toObject(),
      fecha: archivoNuevo.fecha.toISOString().split('T')[0].replace(/-/g, '/')
    };
    res.status(201).json({
      mensaje: "El archivo fue subido con éxito",
      archivo: archivoFormateado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error en el servidor al subir el archivo",
    });
  }
};

//get

export const listaSubirArchivo = async (req, res) => {
  try {
    const { nombreCliente, fecha } = req.query;
    let filtro = {};

    if (nombreCliente) {
      filtro.nombreCliente = { $regex: nombreCliente, $options: 'i' };
    }

    if (fecha) {
      const fechaInicio = new Date(fecha);
      const fechaFin = new Date(fecha);
      fechaFin.setDate(fechaFin.getDate() + 1);
      filtro.fecha = { $gte: fechaInicio, $lt: fechaFin };
    }

    const archivos = await SubirArchivo.find(filtro);
    const archivosFormateados = archivos.map(archivo => ({
      ...archivo.toObject(),
      fecha: archivo.fecha.toISOString().split('T')[0].replace(/-/g, '/')
    }));
    res.status(200).json(archivosFormateados);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error al obtener los Archivos",
    });
  }
};

//get por id
export const obtenerSubirArchivoPorId = async (req, res) => {
  try {
    const obtenerSubirArchivoPorId = await SubirArchivo.findById(req.params.id);
    if (!obtenerSubirArchivoPorId) {
      return res.status(404).json({
        mensaje: "El archivo con ese ID no existe",
      });
    }
    const archivoFormateado = {
      ...obtenerSubirArchivoPorId.toObject(),
      fecha: obtenerSubirArchivoPorId.fecha.toISOString().split('T')[0].replace(/-/g, '/')
    };
    res.status(200).json(archivoFormateado);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error al obtener el archivo por ID",
    });
  }
};

//delete
export const eliminarSubirArchivo = async (req, res) => {
  try {
    const ArchivoBorrado = await SubirArchivo.findByIdAndDelete(req.params.id);
    if (!ArchivoBorrado) {
      return res.status(404).json({
        mensaje: "El archivo con ese ID no existe",
      });
    }
    await cloudinary.uploader.destroy(
      ArchivoBorrado.seleccionarArchivo.public_id,
      {
        resource_type: "image",
      }
    );

    res.status(200).json({
      mensaje: "archivo eliminado con exito",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error al borrar el archivo por ID",
    });
  }
};

// update

export const editarSubirArchivo = async (req, res) => {
  try {
    const archivoExistente = await SubirArchivo.findById(req.params.id);
    if (!archivoExistente) {
      return res.status(404).json({
        mensaje: "El archivo con ese ID no existe",
      });
    }

    let updateData = req.body;

    if (req.file) {
      const resultado = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        folder: "archivos_pdf",
        pages: true,
      });

      fs.unlinkSync(req.file.path);

      
      if (archivoExistente.seleccionarArchivo && archivoExistente.seleccionarArchivo.public_id) {
        await cloudinary.uploader.destroy(archivoExistente.seleccionarArchivo.public_id, {
          resource_type: "image",
        });
      }
      updateData.seleccionarArchivo = {
        url: resultado.secure_url,
        public_id: resultado.public_id,
        nombre: req.file.originalname || archivoExistente.seleccionarArchivo.nombre,
      };
    }

    const ArchivoEditado = await SubirArchivo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    const archivoFormateado = {
      ...ArchivoEditado.toObject(),
      fecha: ArchivoEditado.fecha.toISOString().split('T')[0].replace(/-/g, '/')
    };
    res.status(200).json({
      mensaje: "Archivo actualizado con exito",
      archivo: archivoFormateado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error al actualizar el archivo por ID",
    });
  }
};

// descargar
export const descargarSubirArchivo = async (req, res) => {
  try {
    const archivo = await SubirArchivo.findById(req.params.id);
    if (!archivo) {
      return res.status(404).json({
        mensaje: "El archivo con ese ID no existe",
      });
    }

  
    res.redirect(archivo.seleccionarArchivo.url + "?fl_attachment");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error al descargar el archivo",
    });
  }
};
