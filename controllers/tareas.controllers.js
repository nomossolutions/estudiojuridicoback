import Tarea from "../models/tarea.js";

export const crearTarea = async (req, res) => {
  try {
    if (req.body.fecha) {
      const fecha = new Date(req.body.fecha);
      if (!isNaN(fecha)) {
        req.body.fecha = fecha.toISOString();
      } else {
        return res.status(400).json({ mensaje: "Fecha inválida" });
      }
    }
    const tareaNueva = new Tarea(req.body);
    await tareaNueva.save();
    const tareaGuardada = await Tarea.findById(tareaNueva._id).populate(
      "abogado",
      "nombre apellido role"
    );
    res.status(201).json(tareaGuardada);
    console.log("Body recibido en POST:", req.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Erorr en el servidor al crear la tarea" });
  }
};

export const listarTarea = async (req, res) => {
  try {
    const { estado, fecha } = req.query;
    const filtro = {};

    if (estado) {
      filtro.estado = estado;
    }

    if (fecha) {
      const fechaInicio = new Date(`${fecha}T00:00:00`);
      const fechaFin = new Date(`${fecha}T23:59:59`);
      filtro.fecha = { $gte: fechaInicio, $lte: fechaFin };
    }

    const listaTarea = await Tarea.find(filtro).populate(
      "abogado",
      "nombre apellido role"
    );
    const tareaTransformada = listaTarea.map((tarea) => ({
      _id: tarea._id,
      fecha: tarea.fecha.toISOString().split("T")[0],
      descripcion: tarea.descripcion,
      prioridad: tarea.prioridad,
      estado: tarea.estado,
      abogado: {
        _id: tarea.abogado?._id,
        nombre: tarea.abogado?.nombre,
        apellido: tarea.abogado?.apellido,
        role: tarea.abogado?.role,
      },
    }));
    res.status(200).json(tareaTransformada);
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor al obtener los usuarios",
    });
  }
};

export const listarTareaPorID = async (req, res) => {
  try {
    const listaDeTareaPorID = await Tarea.findById(req.params.id).populate(
      "abogado",
      "nombre apellido role"
    );
    if (!listaDeTareaPorID) {
      return res.status(404).json({ mensaje: "Tarea no encontrado" });
    }
    res.status(200).json(listaDeTareaPorID);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error en el servidor al obtener los usuarios ",
    });
  }
};

export const borrarTareaPorID = async (req, res) => {
  try {
    const tareaBorrada = await Tarea.findByIdAndDelete(req.params.id);
    if (!tareaBorrada) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada por ese ID",
      });
    }
    res.status(200).json({
      mensaje: "Tarea eliminada con exito",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Error en el servidor al obtener los usuarios" });
  }
};

export const actualizarTareaPorID = async (req, res) => {
  try {
    if (req.body.fecha) {
      const fecha = new Date(req.body.fecha);
      if (!isNaN(fecha)) {
        req.body.fecha = fecha.toISOString();
      } else {
        return res.status(400).json({ mensaje: "Fecha inválida" });
      }
    }
    const tareaActualizada = await Tarea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("abogado", "nombre apellido role");
    if (!tareaActualizada) {
      return res
        .status(404)
        .json({ mensaje: "Tarea no encontrada por ese ID" });
    }
    res.status(200).json(tareaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error en el servidor al obtener los usuarios",
    });
  }
};
