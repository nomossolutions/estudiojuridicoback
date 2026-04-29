import Facturacion from "../models/facturacion.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

//POST
export const crearFacturacion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ mensaje: "Debe subir un archivo" });
    }
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "facturas_pdf",
      access_mode: "public",
    });
    fs.unlinkSync(req.file.path);
    const facturacionNuevo = new Facturacion({
      fecha: req.body.fecha,
      nombreCliente: req.body.nombreCliente,
      concepto: req.body.concepto,
      seleccionarArchivo: {
        url: resultado.secure_url,
        public_id: resultado.public_id,
        nombre: req.file.originalname,
      },
      monto: req.body.monto,
      estado: req.body.estado,
    });
    await facturacionNuevo.save();
    const facturaFormateada ={
      ...facturacionNuevo.toObject(),
      fecha: facturacionNuevo.fecha.toISOString().split('T')[0].replace(/-/g, '/')
    };
    res.status(201).json({
      mensaje: "Facturación fue subida con éxito",
      archivo: facturaFormateada,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Error en el servidor al crear facturación" });
  }
};
//get
export const listaFacturacion = async (req, res) => {
  try {
    const { nombreCliente,  estado, fecha } = req.query;
    const filtro = {};

    if (nombreCliente) {
      filtro.nombreCliente = { $regex: nombreCliente, $options: "i" };
    }
    if (estado) {
      filtro.estado = { $regex: `^${estado}$`, $options: "i" };
    }
    if (fecha) {
      const fechaInicio = new Date(`${fecha}T00:00:00`);
      const fechaFin = new Date(`${fecha}T23:59:59`);
      filtro.fecha = { $gte: fechaInicio, $lte: fechaFin };
    }

    const listaFacturas = await Facturacion.find(filtro);
    const facturaTransformada = listaFacturas.map((factura) => ({
     ...factura.toObject()  
     , fecha: factura.fecha.toISOString().split('T')[0].replace(/-/g, '/')
    }));
    res.status(200).json(facturaTransformada);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error al obtener las facturas",
    });
  }
};

//get por id
export const obtenerFacturacionPorId = async (req, res) => {
  try {
    const obtenerFacturacionPorId = await Facturacion.findById(req.params.id);
    if (!obtenerFacturacionPorId) {
      return res.status(404).json({
        mensaje: "La facturacion con ese ID no existe",
      });
    }
    const facturaFormateada = {
      ...obtenerFacturacionPorId.toObject(),
      fecha: obtenerFacturacionPorId.fecha.toISOString().split('T')[0].replace(/-/g, '/')
    };
    res.status(200).json(facturaFormateada);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "La facturacion el archivo por ID",
    });
  }
};

//delete
export const eliminarFacturacion = async (req, res) => {
  try {
    const facturacionBorrado = await Facturacion.findByIdAndDelete(
      req.params.id
    );
    if (!facturacionBorrado) {
      return res.status(404).json({
        mensaje: "La factura con ese ID no existe",
      });
    }
    await cloudinary.uploader.destroy(
      facturacionBorrado.seleccionarArchivo.public_id,
      {
        resource_type: "raw",
      }
    );
    res.status(200).json({
      mensaje: "La factura fue eliminada con exito",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error al borrar la factura por ID",
    });
  }
};
// update

export const editarFacturacion = async (req, res) => {
  try {
    const facturaActual = await Facturacion.findById(req.params.id);
    if (!facturaActual) {
      return res.status(404).json({ mensaje: "Factura no encontrada" });
    }
    let updateData = req.body;
    if (req.file) {
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "facturas_pdf",
    });
      fs.unlinkSync(req.file.path);
      if (
        facturaActual.seleccionarArchivo &&
        facturaActual.seleccionarArchivo.public_id
      ) {
        await cloudinary.uploader.destroy(
          facturaActual.seleccionarArchivo.public_id,
          {
            resource_type: "raw",
          }
        );
      }
      updateData.seleccionarArchivo = {
        url: resultado.secure_url,
        public_id: resultado.public_id,
        nombre: req.file.originalname,
      };
    }
    const facturacionEditado = await Facturacion.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    const archivoFormateado = {
      ...facturacionEditado.toObject(),
      fecha: facturacionEditado.fecha
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "/"),
    };
    res
      .status(200)
      .json({
        mensaje: "Facturación actualizada con éxito",
        factura: facturacionEditado,
      });
  } catch (error) {
    console.error(
      "Error al actualizar:",);
    res
      .status(400)
      .json({
        mensaje: "Error al actualizar factura",
      });
  }
};

export const descargarFacturacion = async (req, res) => {
  try {
    const factura = await Facturacion.findById(req.params.id);
    if (!factura) {
      return res
        .status(404)
        .json({ mensaje: "La factura con ese ID no existe" });
    }
    const urlDescarga = factura.seleccionarArchivo.url + "?fl_attachment";
    res.redirect(urlDescarga);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al descargar la factura" });
  }
};
