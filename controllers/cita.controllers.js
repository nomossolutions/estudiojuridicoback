import Cita from "../models/cita.js";

export const crearCita = async (req, res) => {
  try {
    const citaNueva = new Cita(req.body);
    await citaNueva.save();
    const citaGuardada = await Cita.findById(citaNueva._id).populate(
      "abogado",
      "nombre apellido role"
    );
    res.status(201).json(citaGuardada);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al crear la cita",
    });
  }
};

export const listarCita = async (req, res) => {
  try {
    const { cliente, fecha } = req.query;
    const filtro = {};

    if (cliente) {
      filtro.cliente = { $regex: cliente, $options: "i" };
    }

    if (fecha) {
      const fechaInicio = new Date(`${fecha}T00:00:00`);
      const fechaFin = new Date(`${fecha}T23:59:59`);
      filtro.fecha = { $gte: fechaInicio, $lte: fechaFin };
    }
    const listaCita = await Cita.find(filtro).populate(
      "abogado",
      "nombre apellido role"
    );

    const citaTransformada = listaCita.map((cita) => ({
      _id: cita._id,
      fecha: cita.fecha.toISOString().split("T")[0],
      hora: cita.hora,
      cliente: cita.cliente,
      tipoEvento: cita.tipoEvento,
      notas: cita.notas,
      abogado: {
        _id: cita.abogado?._id,
        nombre: cita.abogado?.nombre,
        apellido: cita.abogado?.apellido,
        role: cita.abogado?.role,
      },
    }));

    res.status(200).json(citaTransformada);
  } catch (error) {
    console.error("Error en listarCita:", error);
    res.status(500).json({ mensaje: "Error al obtener las citas" });
  }
};

export const listarCitaId = async (req, res) => {
  try {
    const listarCitaId = await Cita.findById(req.params.id).populate(
      "abogado",
      "nombre apellido role"
    );
    if (!listarCitaId) {
      return res.status(404).json({ mensaje: "La cita con ese ID no existe" });
    }
    res.status(200).json(listarCitaId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener la cita por ID" });
  }
};

export const borrarCitaId = async (req, res) => {
  try {
    const citaBorrada = await Cita.findByIdAndDelete(req.params.id);
    if (!citaBorrada) {
      return res.status(404).json({ mensaje: "La cita con ese ID no existe" });
    }
    res.status(200).json({ mensaje: "La cita fue borrada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al borrar la cita por ID " });
  }
};

export const editarCitaId = async (req, res) => {
  try {
    const citaEditada = await Cita.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("abogado", "nombre apellido role");
    if (!citaEditada) {
      return res.status(404).json({ mensaje: "La cita con ese ID no existe" });
    }
    res.status(200).json(citaEditada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Erorr al actualizar la cita por ID" });
  }
};
